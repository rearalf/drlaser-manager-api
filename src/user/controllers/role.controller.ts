import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';

import { FilterRoleDto, RoleWithPermissionsDto } from '../dto/filter-role.dto';
import { RoleListItemDto } from '../dto/role-list-item.dto';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';

import { Role } from '../entities/role.entity';

import { RoleService } from '../services/role.service';
import { PaginationHelper } from '@/common/helpers/pagination-helper';

@ApiTags('Role')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @ApiOperation({ summary: 'List all roles with pagination and search' })
  @ApiOkResponse({
    description: 'List of roles retrieved successfully.',
    type: [RoleListItemDto],
  })
  async findAll(
    @Query() filterRoleDto: FilterRoleDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<RoleListItemDto[]> {
    const { data, total } = await this.roleService.findAll(filterRoleDto);

    if (filterRoleDto.pagination) {
      PaginationHelper.setHeaders(res, total, filterRoleDto);
    }

    return data;
  }

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

  @Post()
  @ApiOperation({
    summary: 'Create a new role',
    description:
      'Creates a new role and optionally assigns permissions. Handles restoration of soft-deleted roles.',
  })
  @ApiCreatedResponse({
    description: 'The role has been successfully created or restored.',
    type: Role,
  })
  @ApiConflictResponse({
    description: 'A role with the same name already exists and is active.',
  })
  @ApiNotFoundResponse({
    description: 'One or more provided permission IDs do not exist.',
  })
  @ApiBadRequestResponse({
    description: 'Validation failed (e.g., invalid data types).',
  })
  @ApiBody({ type: CreateRoleDto })
  async create(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return this.roleService.create(createRoleDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a role',
    description:
      'Updates an existing role by ID. Can update name, description, and sync permissions.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The ID of the role to update',
  })
  @ApiOkResponse({
    description: 'The role has been successfully updated.',
    type: Role,
  })
  @ApiNotFoundResponse({
    description: 'Role not found or permissions not found.',
  })
  @ApiConflictResponse({
    description: 'The new name is already taken by another role.',
  })
  @ApiBody({ type: UpdateRoleDto })
  async update(
    @Param('id') id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<Role> {
    return this.roleService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a role (Soft Delete)',
    description:
      'Marks a role as deleted without removing it physically from the database.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID of the role to delete',
  })
  @ApiOkResponse({
    description: 'The role has been successfully deleted.',
  })
  @ApiNotFoundResponse({
    description: 'Role not found or already deleted.',
  })
  async remove(@Param('id') id: number): Promise<void> {
    return this.roleService.remove(id);
  }
}
