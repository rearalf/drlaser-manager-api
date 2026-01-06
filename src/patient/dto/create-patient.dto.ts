import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

import { GENDER_ENUM } from '@/common/enums/person.enum';
import { plainToInstance, Transform, Type } from 'class-transformer';
import { CreatePersonContactDto } from '@/person/dto/create-person-contact.dto';

export class CreatePatientDto {
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
  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: 'El tipo de persona debe ser un número válido.' })
  person_type_id: number;

  // ====================== ARCHIVO ======================
  @ApiProperty({
    description: 'Profile picture file (binary).',
    type: 'string',
    format: 'binary',
    required: false,
  })
  @IsOptional()
  profile_picture?: any;

  @ApiProperty({
    description: 'Name of the profile picture file.',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El nombre del archivo debe ser texto.' })
  profile_picture_name?: string;

  // ====================== CONTACTS ======================
  @ApiProperty({
    description: 'List of contacts. Can be a JSON string if sent via FormData.',
    type: 'string',
    example: '[{"contact_value": "test@test.com", "contact_type": "EMAIL"}]',
    required: false,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        if (value === 'null' || value === 'undefined' || !value) return [];
        return plainToInstance(CreatePersonContactDto, JSON.parse(value));
      } catch (_e) {
        return [];
      }
    }
    return plainToInstance(CreatePersonContactDto, value);
  })
  @Type(() => CreatePersonContactDto)
  person_contacts?: CreatePersonContactDto[];

  // ====================== USER ======================
  @ApiProperty({
    description: 'Email address for the user account.',
    example: 'user@example.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'El correo electrónico no tiene un formato válido.' })
  email?: string;

  @ApiProperty({
    description: 'Password for the user account.',
    example: 'Pass123!',
  })
  @IsOptional()
  @MinLength(8, {
    message: 'La contraseña debe tener al menos 8 caracteres.',
  })
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'La contraseña debe tener mayúsculas, minúsculas y números.',
  })
  password?: string;

  @ApiProperty({
    description: 'List of Role IDs associated with the user.',
    example: [1, 2],
    type: String,
  })
  @IsOptional()
  @Transform(({ value }: { value: string | number[] }) => {
    if (typeof value === 'string') {
      if (!value) return [];
      return value.split(',').map(Number);
    }
    return value;
  })
  @IsArray({ message: 'Los roles deben ser una lista.' })
  @IsNumber({}, { each: true, message: 'Cada ID de rol debe ser un número.' })
  role_ids?: number[];

  // ====================== PATIENT ======================
  @ApiProperty({
    description: "Patient's date of birth (ISO 8601 format).",
    example: '1990-01-01',
    type: String,
  })
  @IsNotEmpty({ message: 'La fecha de nacimiento es obligatoria.' })
  @IsDateString(
    {},
    { message: 'La fecha de nacimiento debe ser válida (AAAA-MM-DD).' },
  )
  birth_date: Date;

  @ApiProperty({
    description: "Patient's gender.",
    enum: GENDER_ENUM,
    example: GENDER_ENUM.FEMALE,
  })
  @IsNotEmpty({ message: 'El género es obligatorio.' })
  @IsEnum(GENDER_ENUM, { message: 'El género seleccionado no es válido.' })
  gender: GENDER_ENUM;

  @ApiProperty({
    description: 'Detailed general medical history.',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString({ message: 'El historial médico debe ser texto.' })
  medical_history?: string;

  @ApiProperty({
    description: 'Known allergic reactions.',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString({ message: 'Las reacciones alérgicas deben ser texto.' })
  allergic_reactions?: string;

  @ApiProperty({
    description: 'Current systemic treatments and medications.',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString({ message: 'El tratamiento actual debe ser texto.' })
  current_systemic_treatment?: string;

  @ApiProperty({
    description: 'Laboratory results details.',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString({ message: 'Los resultados de laboratorio deben ser texto.' })
  lab_results?: string;

  @ApiProperty({
    description: 'Indicates if the complete odontogram chart is attached.',
    example: false,
    required: false,
    nullable: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({
    message: 'El campo odontograma completo debe ser verdadero o falso.',
  })
  complete_odontogram?: boolean;

  @ApiProperty({
    description: 'Contact phone number (El Salvador format).',
    required: false,
    nullable: true,
    example: '7000-0000',
  })
  @IsOptional()
  @IsPhoneNumber('SV', {
    message: 'El número de teléfono no es válido para El Salvador.',
  })
  @MaxLength(50, { message: 'El teléfono no puede exceder los 50 caracteres.' })
  phone?: string;

  @ApiProperty({
    description: "Patient's home address.",
    required: false,
    nullable: true,
    maxLength: 255,
  })
  @IsOptional()
  @IsString({ message: 'La dirección debe ser texto.' })
  @MaxLength(255, {
    message: 'La dirección no puede exceder los 255 caracteres.',
  })
  address?: string;

  @ApiProperty({
    description: "Patient's occupation.",
    required: false,
    nullable: true,
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'La ocupación debe ser texto.' })
  @MaxLength(100, {
    message: 'La ocupación no puede exceder los 100 caracteres.',
  })
  occupation?: string;

  // ====================== SYSTEMIC EVALUATION (BOOLEANS) ======================

  @ApiProperty({
    description: 'Indicates issues with the Central Nervous System (SNC).',
    example: false,
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({ message: 'SNC debe ser verdadero o falso.' })
  has_snc_issues?: boolean;

  @ApiProperty({
    description: 'Indicates issues with the Vascular System (SVC).',
    example: false,
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({ message: 'SVC debe ser verdadero o falso.' })
  has_svc_issues?: boolean;

  @ApiProperty({
    description: 'Indicates issues with the Endocrine System (SE).',
    example: false,
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({ message: 'SE debe ser verdadero o falso.' })
  has_se_issues?: boolean;

  @ApiProperty({
    description: 'Indicates issues with the Musculoskeletal System (SME).',
    example: false,
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({ message: 'SME debe ser verdadero o falso.' })
  has_sme_issues?: boolean;

  @ApiProperty({
    description: 'Indicates issues with the Respiratory System (SR).',
    example: false,
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({ message: 'SR debe ser verdadero o falso.' })
  has_sr_issues?: boolean;

  @ApiProperty({
    description: 'Indicates issues with the Urinary System (SU).',
    example: false,
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({ message: 'SU debe ser verdadero o falso.' })
  has_su_issues?: boolean;

  @ApiProperty({
    description: 'Indicates issues with the Genitourinary System (SGU).',
    example: false,
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({ message: 'SGU debe ser verdadero o falso.' })
  has_sgu_issues?: boolean;

  @ApiProperty({
    description: 'Indicates issues with the Gastrointestinal System (SGI).',
    example: false,
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({ message: 'SGI debe ser verdadero o falso.' })
  has_sgi_issues?: boolean;

  @ApiProperty({
    description: 'Consolidated notes on the systemic evaluation.',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString({ message: 'Las notas de evaluación sistémica deben ser texto.' })
  system_evaluation_notes?: string;
}
