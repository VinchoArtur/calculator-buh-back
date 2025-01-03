import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class GroupRequest {
  @IsString()
  groupName: string;

  @IsArray()
  type: string;

  @IsArray()
  @IsNumber()
  groupIds?: number[];
}

export interface RequestGroupDto {
  name: string;
  type: string;
  items: number[]
  presents?: {groupId: number, presentId: number}[];
  costs?: {groupId: number, costId: number}[];
  data?: any;
}
