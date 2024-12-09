import { IsNumber, IsString, IsOptional, IsUUID } from 'class-validator';

export class CostRequest {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsString()
  name: string;
  @IsNumber()
  price: number;

  @IsNumber()
  hourlyRate: number;

  @IsNumber()
  hours: number;

  @IsNumber()
  costWithoutProfit: number;

  @IsNumber()
  costWithProfit: number;
}
