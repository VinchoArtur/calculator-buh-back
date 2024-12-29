import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class GroupRequest {
  @IsString()
  groupName: string;

  @IsArray()
  type: string;

  @IsArray()
  @IsNumber()
  groupId?: number[];
}

export interface RequestGroupDto {
  name: string;
  type: string;
  items: number[]
}
