import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GroupRequest {
  @IsString()
  groupName: string;

  @IsOptional()
  @IsNumber()
  groupId?: number;
}
