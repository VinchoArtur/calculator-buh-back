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

@Module({
  imports: [PrismaModule],
  controllers: [
    AppController,
    CostsController,
    AuthController,
    PresentsController,
  ],
  providers: [
    AppService,
    CostsService,
    AuthService,
    FileService,
    PresentsService,
    CostsRepository,
    PresentsRepository,
  ],
})
export class AppModule {}
