import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  Min,
  IsInt,
  Length,
  IsArray,
  IsEmail,
  Matches,
  IsString,
  IsDefined,
  MinLength,
  IsNotEmpty,
  IsOptional,
  ArrayUnique,
} from 'class-validator';

export class CreateDoctorDto {
  // ====================== PERSONA ======================
  @ApiProperty({
    description: 'First name of the person.',
    example: 'Carlos',
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @Length(1, 100, {
    message: 'El nombre debe tener entre 1 y 100 caracteres.',
  })
  first_name: string;

  @ApiProperty({
    description: 'Middle name of the person.',
    example: 'Alberto',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }: { value: string | undefined }) =>
    typeof value === 'string' && value.trim() === ''
      ? undefined
      : value?.trim(),
  )
  @IsString({ message: 'El segundo nombre debe ser una cadena de texto.' })
  @Length(1, 100, {
    message: 'El segundo nombre debe tener entre 1 y 100 caracteres.',
  })
  middle_name?: string;

  @ApiProperty({
    description: 'Last name of the person.',
    example: 'Cruz',
  })
  @IsString({ message: 'El apellido debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El apellido es obligatorio.' })
  @Length(1, 100, {
    message: 'El apellido debe tener entre 1 y 100 caracteres.',
  })
  last_name: string;

  @ApiProperty({
    description: 'ID of the person type being assigned.',
    example: 1,
  })
  @Transform(({ value }: { value: string }) => parseInt(value, 10))
  @IsInt({ message: 'El tipo de persona debe ser un número entero.' })
  @Min(1, { message: 'El tipo de persona debe ser mayor a 0.' })
  person_type_id: number;

  // ====================== ARCHIVO ======================
  @ApiProperty({
    description: 'Profile picture file (binary).',
    type: 'string',
    format: 'binary',
    required: false,
  })
  @IsOptional()
  profile_picture?: Express.Multer.File;

  @ApiProperty({
    description: 'Name of the profile picture file.',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El nombre del archivo debe ser texto.' })
  profile_picture_name?: string;

  // ====================== USER ======================
  @ApiProperty({
    description: 'Email address for the user account.',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'El correo electrónico no tiene un formato válido.' })
  email: string;

  @ApiProperty({
    description: 'Password for the user account.',
    example: 'Pass123!',
  })
  @MinLength(8, {
    message: 'La contraseña debe tener al menos 8 caracteres.',
  })
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'La contraseña debe contener mayúsculas, minúsculas y al menos un número o símbolo.',
  })
  password: string;

  @ApiProperty({
    description: 'List of Role IDs associated with the user.',
    example: [1, 2],
    type: [Number],
  })
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value.map((v) => Number(v));
    }
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value) as unknown;
        if (Array.isArray(parsed)) {
          return (parsed as unknown[]).map((v) => Number(v));
        }
      } catch {
        return value.split(',').map((v) => Number(v.trim()));
      }
    }
    return [];
  })
  @IsArray({ message: 'Los roles deben ser una lista.' })
  @IsInt({ each: true, message: 'Cada ID de rol debe ser un número.' })
  role_ids: number[];

  // ====================== DOCTOR ======================
  @ApiProperty({
    example:
      'It is a person who graduated from x university, with a specialty in x',
    description: 'The qualification of the doctor',
  })
  @IsOptional()
  @IsString({ message: 'La calificación debe de ser una cadena de texto.' })
  qualification?: string;

  @ApiProperty({
    example: 1,
    description: 'It is the specific specialty that this doctor has.',
  })
  @Transform(({ value }: { value: string }) => parseInt(value))
  @IsDefined({ message: 'La especialidad principal es obligatoria.' })
  @IsInt({ message: 'La especialidad principal no es válida.' })
  @Min(1)
  specialty_id: number;

  @ApiProperty({
    example: [1, 2, 3],
    description: 'It is the specialties ids',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value.map((v) => Number(v));
    }
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value) as unknown;
        if (Array.isArray(parsed)) {
          return (parsed as unknown[]).map((v) => Number(v));
        }
      } catch {
        // Si no es JSON, intenta dividir por comas
        return value.split(',').map((v) => Number(v.trim()));
      }
    }
    return [];
  })
  @IsArray({ message: 'Las especialidades no son válidas.' })
  @ArrayUnique({
    message: 'Las especialidades secundarias no deben repetirse.',
  })
  @IsInt({ each: true, message: 'Las especialidades no son válidas.' })
  specialty_ids?: number[];
}
