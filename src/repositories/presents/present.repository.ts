import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../modules/prisma/services/prisma.service';
import { PresentRequest } from '../../dtos/presents/presents.dto';

@Injectable()
export class PresentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(present: PresentRequest) {
    return this.prisma.present.create({
      data: present,
    });
  }

  async findAll() {
    return this.prisma.present.findMany();
  }

  async findById(id: string) {
    return this.prisma.present.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: Partial<PresentRequest>) {
    return this.prisma.present.update({
      where: { id },
      data: data,
    });
  }

  async delete(id: string) {
    return this.prisma.present.delete({
      where: { id },
    });
  }
}
