import { PaginationDto } from '@/common/dto/pagination.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FilterRoleDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Search keyword to filter roles by name.',
    example: 'Odontologo',
  })
  @IsOptional()
  @IsString()
  search?: string;
}

export class RoleWithPermissionsDto {
  id: number;
  name: string;
  description: string;
  permission: number[];
  permissionsGroup: {
    id: number;
    name: string;
    label: string;
    description: string;
    children: {
      id: number;
      name: string;
      label: string;
      description: string;
    }[];
  }[];
}

export class PermissionGroupDto {
  id: number;
  name: string;
  label: string;
  description: string;
  children: Array<{
    id: number;
    name: string;
    label: string;
    description: string;
  }>;
}
