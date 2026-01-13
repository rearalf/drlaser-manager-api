import { ApiProperty } from '@nestjs/swagger';

// DTO pequeño para los permisos dentro de la lista
export class PermissionItemDto {
  @ApiProperty({ example: 1, description: 'ID del permiso' })
  id: number;

  @ApiProperty({
    example: 'create_users',
    description: 'Nombre clave del permiso',
  })
  name: string;

  @ApiProperty({
    example: 'Crear Usuarios',
    description: 'Nombre legible del permiso',
  })
  label: string;
}

// DTO principal para la lista de roles
export class RoleListItemDto {
  @ApiProperty({ example: 1, description: 'ID del rol' })
  id: number;

  @ApiProperty({ example: 'Administrador', description: 'Nombre del rol' })
  name: string;

  @ApiProperty({
    example: 'Tiene acceso total al sistema',
    description: 'Descripción del rol',
    nullable: true,
  })
  description: string;

  @ApiProperty({
    type: [PermissionItemDto], // 👈 Importante para que Swagger muestre el array anidado
    description: 'Lista de permisos asignados a este rol',
  })
  permissions: PermissionItemDto[];
}
