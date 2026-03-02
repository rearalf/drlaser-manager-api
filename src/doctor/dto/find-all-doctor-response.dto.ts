import { ApiProperty } from '@nestjs/swagger';

export class DoctorSpecialtyResponseDto {
  @ApiProperty({ example: 1, description: 'ID de la especialidad' })
  id: number;

  @ApiProperty({
    example: 'Ortodoncia',
    description: 'Nombre de la especialidad',
  })
  name: string;

  @ApiProperty({
    example: 'Especialidad enfocada en corrección dental',
    description: 'Descripción de la especialidad',
    nullable: true,
  })
  description?: string | null;
}

export class DoctorListItemResponseDto {
  @ApiProperty({ example: 5, description: 'ID del doctor' })
  id: number;

  @ApiProperty({
    example: 'COD-987654',
    description: 'Colegiatura o número de licencia del doctor',
    nullable: true,
  })
  qualification?: string | null;

  @ApiProperty({
    type: DoctorSpecialtyResponseDto,
    description: 'Especialidad principal del doctor',
  })
  primarySpecialty: DoctorSpecialtyResponseDto;

  @ApiProperty({ example: 10, description: 'ID de la persona asociada' })
  person_id: number;

  @ApiProperty({
    example: 'José Alfredo Hernandez',
    description: 'Nombre completo del doctor',
  })
  full_name: string;

  @ApiProperty({
    example: 'https://cdn.example.com/ana.jpg',
    description: 'URL de la foto de perfil',
    nullable: true,
  })
  profile_picture_url?: string | null;

  @ApiProperty({
    example: 'ana.jpg',
    description: 'Nombre de archivo de la foto de perfil',
    nullable: true,
  })
  profile_picture_name?: string | null;

  @ApiProperty({ example: 1, description: 'ID del usuario', nullable: true })
  user_id?: number | null;

  @ApiProperty({
    example: 'doctor@drlaser.com',
    description: 'Correo del usuario asociado al doctor',
    nullable: true,
  })
  email?: string | null;
}
