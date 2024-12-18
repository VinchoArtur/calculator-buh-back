import { IsNumber, IsString, IsOptional, IsUUID } from 'class-validator';

export class PresentRequest {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  groupId?: number;
}
