import { Injectable } from '@nestjs/common';
import { BaseRepositoryImpl } from '../baseRepository';
import { PrismaService } from '../../modules/prisma/services/prisma.service';

@Injectable()
export class CostGroupRepository extends BaseRepositoryImpl<any> {

  constructor(prisma: PrismaService) {
    super(prisma, 'costGroup');
  }
}