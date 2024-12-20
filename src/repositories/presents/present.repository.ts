import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/services/prisma.service';
import { PresentRequest } from 'src/dtos/presents/presents.dto';
import { BaseRepositoryImpl } from '../baseRepository';

@Injectable()
export class PresentsRepository extends BaseRepositoryImpl<PresentRequest> {
  constructor(prisma: PrismaService) {
    super(prisma, 'present');
  }

  async create(present: PresentRequest) {
    return this.prisma.present.create({
      data: {
        name: present.name,
        price: present.price,
        description: present.description,
        Group: present.groupId
          ? { connect: { id: present.groupId } }
          : undefined,
      },
    });
  }
}
