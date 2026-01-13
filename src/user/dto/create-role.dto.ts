import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'Admin', description: 'The name for the role' })
  @IsString({ message: 'El nombre debe de ser solo texto.' })
  name: string;

  @ApiProperty({
    example: 'This role has full control',
    description: 'It is the description to the role',
  })
  @IsString({ message: 'La descripción debe de ser solo texto.' })
  description: string;

  @ApiProperty({
    example: [1, 2, 3],
    description: 'It is the permissions ids',
  })
  @IsArray({ message: 'Los permisos no son validos.' })
  @IsNumber({}, { each: true, message: 'El permiso no es valido.' })
  permission_id: number[];
}
