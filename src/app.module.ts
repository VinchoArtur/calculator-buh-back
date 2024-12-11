import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AddCostsController } from './controllers/add-costs/add-costs.controller';
import { AddCostsService } from './services/add-costs/add-costs.service';
import { AuthController } from './controllers/auth/auth.controller';
import { AuthService } from './services/auth/auth.service';
import { FileService } from './controllers/file/file.service';

@Module({
  imports: [],
  controllers: [AppController, AddCostsController, AuthController],
  providers: [AppService, AddCostsService, AuthService, FileService],
})
export class AppModule {}
