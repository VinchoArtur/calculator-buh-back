import { BadRequestException } from '@nestjs/common';

export class GroupRelationException extends BadRequestException {
  constructor(
    message: string,
    details?: any
  ) {
    super({
      message,
      error: 'Group Relation Error',
      details
    });
  }
}

import { NotFoundException } from '@nestjs/common';

export class ResourceNotFoundException extends NotFoundException {
  constructor(
    resourceType: string,
    id: string | number,
    details?: any
  ) {
    super({
      message: `${resourceType} with ID ${id} not found`,
      error: 'Resource Not Found',
      details
    });
  }
}

import { ConflictException } from '@nestjs/common';

export class DuplicateResourceException extends ConflictException {
  constructor(
    resourceType: string,
    details?: any
  ) {
    super({
      message: `${resourceType} already exists`,
      error: 'Duplicate Resource',
      details
    });
  }
}