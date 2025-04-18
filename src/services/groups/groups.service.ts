import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { GroupRequest, RequestGroupDto } from 'src/dtos/groups/group.dto';
import { GroupsRepository } from 'src/repositories/groups/groups.repository';
import { BaseService } from '../baseService';
import { GroupRequestMapper } from '../../mapper/group/group-request-mapper';
import { CostsRepository } from '../../repositories/costs/costs.repository';
import { PresentsRepository } from '../../repositories/presents/present.repository';
import { CostGroupRepository } from '../../repositories/groups/cost-group.repository';
import { CostRequest } from '../../dtos/costs/costs.dto.';
import { PresentGroupRepository } from '../../repositories/groups/present-group.repository';
import { PresentRequest } from '../../dtos/presents/presents.dto';
import { PrismaService } from '../../modules/prisma/services/prisma.service';
import { GroupRelationException } from '../../exceptions/group-relation.exception';

@Injectable()
export class GroupsService extends BaseService<
  RequestGroupDto,
  { id: number }
> {
  private readonly logger = new Logger(GroupsService.name);
  
  constructor(
    private readonly groupsRepository: GroupsRepository,
    private readonly costsRepository: CostsRepository,
    private readonly presentsRepository: PresentsRepository,
    private readonly costGroupRepository: CostGroupRepository,
    private readonly presentGroupRepository: PresentGroupRepository,
    private readonly prisma: PrismaService,
  ) {
    super(groupsRepository);
  }

  protected getModelName(): string {
    return 'Group';
  }

  async addData(data: RequestGroupDto): Promise<{
    id: number;
    name: string;
    type: string;
    items: number[];
    data: any[];
  }> {
    const requestData: GroupRequest = GroupRequestMapper.toRequest(data);
    const existingGroup = await this.groupsRepository.findGroupByName(
      requestData.groupName,
    );

    if (existingGroup && existingGroup.type === requestData.type) {
      throw new BadRequestException({
        message: 'Group already exists',
        groupId: existingGroup.id,
      });
    }

    const groupRequest = {
      groupName: requestData.groupName,
      type: requestData.type,
    };

    const newGroup = await this.groupsRepository.createData(groupRequest);
    let items: any[] = [];
    if (newGroup) {
      switch (newGroup.type) {
        case 'presents':
          await this.groupsRepository.updatePresentsData(
            requestData.groupIds,
            newGroup.id,
          );
          const presentItems = await this.presentsRepository.findByIds(
            requestData.groupIds,
          );
          items = presentItems;
          break;
        case 'costs':
          await this.groupsRepository.updateCostsData(
            requestData.groupIds,
            newGroup.id,
          );
          const costItems = await this.costsRepository.findByIds(
            requestData.groupIds,
          );
          items = costItems;
          break;
      }
    }

    return {
      id: newGroup.id,
      name: newGroup.groupName,
      type: newGroup.type,
      items: requestData.groupIds,
      data: items,
    };
  }

  public async prepareResData(
    requestGroupDtos: RequestGroupDto[],
  ): Promise<RequestGroupDto[]> {
    return await Promise.all(
      requestGroupDtos.map(async (group) => {
        if (group.type === 'costs') {
          const costIds = group.costs.map((cost) => cost.groupId);
          group.data = (await this.getCostsData(group?.items ?? costIds)) ?? [];
        } else if (group.type === 'presents') {
          const presentsIds = group.presents.map((present) => present.groupId);
          group.data = (await this.getPresentsData(group?.items ?? presentsIds)) ?? [];
        }
        return group;
      }),
    );
  }

  public async getCostsData(ids: number[]): Promise<CostRequest> {
    const costGroupData: { groupId: number; costId: number }[] =
      await this.costGroupRepository.findByGroupIds(ids);
    if (costGroupData && costGroupData.length > 0) {
      const costIds = costGroupData
        .filter((res) => res.costId)
        .map((res) => res.costId);
      if (costIds && costIds.length > 0) {
        return await this.costsRepository.findByIds(costIds);
      }
    }
  }

  async getPresentsData(ids: number[]): Promise<PresentRequest> {
    const presentGroupData: {
      groupId: number;
      presentId: number;
    }[] = await this.presentGroupRepository.findByGroupIds(ids);
    if (presentGroupData && presentGroupData.length > 0) {
      const presentIds = presentGroupData
        .filter((present) => present.presentId)
        .map((res) => res.presentId);
      if (presentIds && presentIds.length > 0) {
        return await this.presentsRepository.findByIds(presentIds);
      }
    }
  }

  /**
   * Переопределённый метод для обновления группы.
   * Учитывает, какой тип данных (costs или presents) нужно обновить,
   * основываясь на типе самой группы (type).
   */
  async updateData(id: number, updatedData: Partial<RequestGroupDto>): Promise<RequestGroupDto> {
    try {
      const existingGroup = await this.groupsRepository.findById(id);
      if (!existingGroup) {
        throw new NotFoundException(`Group with ID ${id} not found!`);
      }

      return this.prisma.$transaction(async (tx) => {
        try {
          await this.processGroupRelations(existingGroup, updatedData, id, tx);
          
          if (updatedData.items && updatedData.items.length > 0) {
            await this.syncRelationsWithItems(tx, id, existingGroup.type, updatedData.items);
          }
          
          const baseData = this.prepareBaseData(updatedData);
          

          const updatedGroup = await this.updateGroupData(id, baseData, tx);

          return this.mapUpdatedGroup(updatedGroup);
        } catch (error) {
          this.logger.error(
            `Transaction error updating group ${id}: ${error.message}`,
            error.stack
          );
          throw error;
        }
      });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      
      this.logger.error(
        `Unexpected error updating group ${id}: ${error.message}`, 
        error.stack
      );
      throw new GroupRelationException(
        'Ошибка при обновлении группы', 
        { 
          groupId: id,
          originalError: error.message 
        }
      );
    }
  }

  /**
   * Обрабатывает отношения группы (costs или presents) 
   * в зависимости от типа группы.
   */
  private async processGroupRelations(
    existingGroup: any, 
    updatedData: Partial<RequestGroupDto>, 
    id: number, 
    tx: any
  ): Promise<void> {
    if (existingGroup.type === 'costs' && updatedData.costs?.length) {
      await this.processCostsRelations(updatedData.costs, id, tx);
    } else if (existingGroup.type === 'presents' && updatedData.presents?.length) {
      await this.processPresentsRelations(updatedData.presents, id, tx);
    }
  }

  /**
   * Обрабатывает отношения costs для группы.
   */
  private async processCostsRelations(
    costs: { groupId: number; costId: number }[], 
    groupId: number, 
    tx: any
  ): Promise<void> {
    this.logger.log(`Costs для обновления: ${JSON.stringify(costs)}`);
    
    for (const cost of costs) {
      try {
        await this.validateCostExists(cost.costId);
        await this.createCostGroupRelationIfNotExists(groupId, cost.costId, tx);
      } catch (error) {
        this.logger.error(`Ошибка при проверке/создании cost ${cost.costId}: ${error.message}`, error.stack);
        
        if (error instanceof NotFoundException) {
          throw error;
        }
        
        throw new GroupRelationException(
          `Ошибка при связывании группы с cost ${cost.costId}`,
          { costId: cost.costId, groupId, originalError: error.message }
        );
      }
    }
  }

  /**
   * Проверяет существование cost.
   */
  private async validateCostExists(costId: number): Promise<void> {
    const costExists = await this.costsRepository.findById(costId);
    if (!costExists) {
      throw new NotFoundException(`Cost с ID ${costId} не найден`);
    }
  }

  /**
   * Создаёт связь между группой и cost, если она не существует.
   */
  private async createCostGroupRelationIfNotExists(
    groupId: number, 
    costId: number, 
    tx: any
  ): Promise<void> {
    const costGroupExists = await this.prisma.costGroup.findUnique({
      where: {
        groupId_costId: {
          groupId: Number(groupId),
          costId: costId,
        },
      },
    });
    
    if (!costGroupExists) {
      console.log(`Создаём отсутствующую связь: groupId=${groupId}, costId=${costId}`);
      await tx.costGroup.create({
        data: {
          groupId: Number(groupId),
          costId: costId,
        },
      });
    }
  }

  /**
   * Обрабатывает отношения presents для группы.
   */
  private async processPresentsRelations(
    presents: { groupId: number; presentId: number }[], 
    groupId: number, 
    tx: any
  ): Promise<void> {
    this.logger.log(`Presents для обновления: ${JSON.stringify(presents)}`);
    
    for (const present of presents) {
      try {
        await this.validatePresentExists(present.presentId);
        await this.createPresentGroupRelationIfNotExists(groupId, present.presentId, tx);
      } catch (error) {
        this.logger.error(`Ошибка при проверке/создании present ${present.presentId}: ${error.message}`, error.stack);
        
        if (error instanceof NotFoundException) {
          throw error;
        }
        
        throw new GroupRelationException(
          `Ошибка при связывании группы с present ${present.presentId}`,
          { presentId: present.presentId, groupId, originalError: error.message }
        );
      }
    }
  }

  /**
   * Проверяет существование present.
   */
  private async validatePresentExists(presentId: number): Promise<void> {
    const presentExists = await this.presentsRepository.findById(presentId);
    if (!presentExists) {
      throw new NotFoundException(`Present с ID ${presentId} не найден`);
    }
  }

  /**
   * Создаёт связь между группой и present, если она не существует.
   */
  private async createPresentGroupRelationIfNotExists(
    groupId: number, 
    presentId: number, 
    tx: any
  ): Promise<void> {
    const presentGroupExists = await this.prisma.presentGroup.findUnique({
      where: {
        groupId_presentId: {
          groupId: Number(groupId),
          presentId: presentId,
        },
      },
    });
    
    if (!presentGroupExists) {
      console.log(`Создаём отсутствующую связь: groupId=${groupId}, presentId=${presentId}`);
      await tx.presentGroup.create({
        data: {
          groupId: Number(groupId),
          presentId: presentId,
        },
      });
    }
  }

  /**
   * Синхронизирует связи в базе данных с items.
   */
  private async syncRelationsWithItems(
    tx: any, 
    groupId: number, 
    groupType: string, 
    items: number[]
  ): Promise<void> {
    try {
      if (!items || items.length === 0) {
        return;
      }
      
      const itemsSet = new Set(items.map(id => Number(id)));
      
      if (groupType === 'costs') {
        const existingRelations = await tx.costGroup.findMany({
          where: { groupId: Number(groupId) }
        });
        
        for (const relation of existingRelations) {
          if (!itemsSet.has(Number(relation.costId))) {
            await tx.costGroup.delete({
              where: {
                groupId_costId: {
                  groupId: Number(groupId),
                  costId: relation.costId
                }
              }
            });
          }
        }
      } else if (groupType === 'presents') {
        const existingRelations = await tx.presentGroup.findMany({
          where: { groupId: Number(groupId) }
        });
        
        for (const relation of existingRelations) {
          if (!itemsSet.has(Number(relation.presentId))) {
            await tx.presentGroup.delete({
              where: {
                groupId_presentId: {
                  groupId: Number(groupId),
                  presentId: relation.presentId
                }
              }
            });
          }
        }
      }
    } catch (error) {
      this.logger.error(
        `Ошибка при синхронизации связей для группы ${groupId}: ${error.message}`,
        error.stack
      );
      
      throw new GroupRelationException(
        `Ошибка при синхронизации элементов группы ${groupId}`,
        { 
          groupId,
          groupType,
          items,
          originalError: error.message 
        }
      );
    }
  }

  /**
   * Подготавливает базовые данные для обновления группы.
   */
  private prepareBaseData(updatedData: Partial<RequestGroupDto>): any {
    const baseData = {
      groupName: updatedData.groupName,
      type: updatedData.type,
      items: updatedData.items,
    };

    Object.keys(baseData).forEach((key) => {
      if (baseData[key] === undefined) {
        delete baseData[key];
      }
    });

    return baseData;
  }

  /**
   * Обновляет данные группы.
   */
  private async updateGroupData(id: number, baseData: any, tx: any): Promise<any> {
    return tx.group.update({
      where: { id: Number(id) },
      data: baseData,
      include: {
        costs: true,
        presents: true,
      },
    });
  }

/**
 * Преобразует обновленные данные группы в формат ответа.
 * Фильтрует costs или presents так, чтобы они соответствовали ids в items.
 */
private mapUpdatedGroup(updatedGroup: any): RequestGroupDto {
  const items = Array.isArray(updatedGroup.items)
    ? updatedGroup.items.map((item) => Number(item))
    : [];

  const result: RequestGroupDto = {
    ...updatedGroup,
    items: items,
  };

  if (updatedGroup.type === 'costs' && updatedGroup.costs) {
    result.costs = this.filterRelationsByItems(updatedGroup.costs, items, 'costId');
    result.presents = [];
  } else if (updatedGroup.type === 'presents' && updatedGroup.presents) {
    result.presents = this.filterRelationsByItems(updatedGroup.presents, items, 'presentId');
    result.costs = [];
  }

  return result;
}

/**
 * Фильтрует связи по ID элементов, указанных в items.
 */
private filterRelationsByItems(relations: any[], items: number[], idFieldName: string): any[] {
  if (!items || items.length === 0 || !relations || relations.length === 0) {
    return [];
  }

  const itemsSet = new Set(items.map(id => Number(id)));
  
  return relations.filter(relation => itemsSet.has(Number(relation[idFieldName])));
}
}