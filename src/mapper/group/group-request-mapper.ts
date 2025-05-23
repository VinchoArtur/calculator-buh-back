import { GroupRequest, RequestGroupDto } from '../../dtos/groups/group.dto';

export class GroupRequestMapper {
  static toRequest(data: RequestGroupDto): GroupRequest {
    return {
      groupIds: data.items,
      groupName: data.groupName,
      type: data.type
    }
  }
}