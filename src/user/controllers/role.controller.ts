import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { RoleWithPermissionsDto } from '../dto/filter-role.dto';

import { RoleService } from '../services/role.service';

@ApiTags('Role')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get(':id')
  @ApiOperation({
    summary: 'Get one role by id',
    description:
      'Returns a role by id, optionally including its permissions structure.',
  })
  @ApiOkResponse({
    description: 'Role retrieved successfully.',
    type: RoleWithPermissionsDto,
  })
  @ApiNotFoundResponse({
    description: 'Role not found.',
  })
  @ApiQuery({
    name: 'withPermission',
    required: false,
    type: Boolean,
    description: 'Whether to include the role permissions hierarchy.',
  })
  async findById(
    @Param('id') id: number,
    @Query('withPermission') withPermission: boolean,
  ): Promise<RoleWithPermissionsDto> {
    return this.roleService.findById(id, withPermission);
  }
}
