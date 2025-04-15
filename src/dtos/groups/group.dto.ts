import { IsArray, IsNumber, IsString } from 'class-validator';

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
  groupName: string;
  type: string;
  items: number[];
  presents?: { groupId: number; presentId: number }[];
  costs?: { groupId: number; costId: number }[];
  data?: any;
}
