import { CONTACT_TYPE_ENUM } from '@/common/enums/person-contact.enum';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  Length,
  IsEmail,
  IsString,
  ValidateIf,
  IsNotEmpty,
  IsPhoneNumber,
} from 'class-validator';

export class CreatePersonContactDto {
  @IsString({ message: 'El valor del contacto debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El valor del contacto es obligatorio.' })
  @Length(1, 255, {
    message: 'El valor del contacto debe tener entre 1 y 255 caracteres.',
  })
  @ApiProperty({
    example: 'carlos@gmail.com',
    description:
      'El valor del contacto (ej. número de teléfono o correo electrónico).',
  })
  @ValidateIf(
    (o: CreatePersonContactDto) => o.contact_type === CONTACT_TYPE_ENUM.EMAIL,
  )
  @IsEmail(
    {},
    { message: 'El valor del contacto debe ser un correo electrónico válido.' },
  )
  @ValidateIf(
    (o: CreatePersonContactDto) => o.contact_type === CONTACT_TYPE_ENUM.PHONE,
  )
  @IsPhoneNumber('SV', {
    message: 'El valor del contacto debe ser un número de teléfono válido.',
  })
  contact_value: string;

  @IsEnum(CONTACT_TYPE_ENUM, {
    message: `El tipo de contacto debe ser uno de los siguientes: ${Object.values(CONTACT_TYPE_ENUM).join(', ')}.`,
  })
  @ApiProperty({
    example: CONTACT_TYPE_ENUM.EMAIL,
    enum: CONTACT_TYPE_ENUM,
    description: 'El tipo de contacto (ej. EMAIL, PHONE, etc.).',
  })
  contact_type: CONTACT_TYPE_ENUM;
}
