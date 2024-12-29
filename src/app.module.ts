import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CostsController } from './controllers/costs/costs.controller';
import { CostsService } from './services/costs/costs.service';
import { AuthController } from './controllers/auth/auth.controller';
import { AuthService } from './services/auth/auth.service';
import { FileService } from './services/file/file.service';
import { PresentsController } from './controllers/presents/presents.controller';
import { PresentsService } from './services/presents/presents.service';
import { PrismaModule } from './modules/prisma/prisma.module';
import { CostsRepository } from './repositories/costs/costs.repository';
import { PresentsRepository } from './repositories/presents/present.repository';
import { GroupsController } from './controllers/groups/groups.controller';
import { GroupsRepository } from './repositories/groups/groups.repository';
import { GroupsService } from './services/groups/groups.service';
import { CostGroupRepository } from './repositories/groups/cost-group.repository';
import { PresentGroupRepository } from './repositories/groups/present-group.repository';

@Module({
  imports: [PrismaModule],
  controllers: [
    AppController,
    CostsController,
    AuthController,
    PresentsController,
    GroupsController,
  ],
  providers: [
    AppService,
    CostsService,
    AuthService,
    FileService,
    PresentsService,
    CostsRepository,
    PresentsRepository,
    GroupsRepository,
    CostGroupRepository,
    PresentGroupRepository,
    GroupsService,
  ],
})
export class AppModule {}
