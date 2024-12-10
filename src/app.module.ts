import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AddCostsController } from './controllers/add-costs/add-costs.controller';
import { AddCostsService } from './services/add-costs/add-costs.service';

@Module({
  imports: [],
  controllers: [AppController, AddCostsController],
  providers: [AppService, AddCostsService],
})
export class AppModule {}
