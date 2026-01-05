import { plainToInstance, Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  Length,
  IsNumber,
  IsString,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';

import { CreatePersonContactDto } from './create-person-contact.dto';

export class CreatePersonDto {
  @ApiProperty({
    example: 'Carlos',
    required: true,
    description: 'First name of the person.',
  })
  @IsString({ message: 'El nombre debe de ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El nombre no debe estar vacio.' })
  @Length(1, 100, {
    message: 'El nombre debe de tener entre 1 y 100 caracteres.',
  })
  first_name: string;

  @ApiProperty({
    example: 'Alberto',
    required: false,
    description: 'Middle name of the person.',
  })
  @IsOptional()
  @IsString({ message: 'El segundo nombre debe de ser una cadena de texto.' })
  @Length(1, 100, {
    message: 'El segundo nombre debe de tener entre 1 y 100 caracteres.',
  })
  middle_name?: string;

  @ApiProperty({
    example: 'Cruz del Monte',
    required: true,
    description: 'Last name of the person.',
  })
  @IsString({ message: 'Los apellidos deben de ser una cadena de texto.' })
  @IsNotEmpty({ message: 'Los apellidos no deben estar vacio.' })
  @Length(1, 100, {
    message: 'Los apellidos debe de tener entre 1 y 100 caracteres.',
  })
  last_name: string;

  @ApiProperty({
    example: 1,
    description:
      'It is the id of the type of person to which it is being assigned.',
  })
  @Transform(({ value }: { value: string }) => parseInt(value))
  @IsNumber({}, { message: 'El tipo de persona no es valido.' })
  person_type_id: number;

  @ApiProperty({
    example: 'profile.jpg',
    required: false,
    type: String,
    nullable: true,
    description: 'The name of the profile picture file.',
  })
  @IsOptional()
  @IsString()
  profile_picture_name?: string;

  @ApiProperty({
    example: 'https://example.com/profile.jpg',
    required: false,
    description: 'The URL of the profile picture.',
  })
  @IsOptional()
  @IsString()
  profile_picture?: string;

  @ApiProperty({
    example: 1,
    required: false,
    description: 'The ID of the user associated with this person.',
  })
  @IsOptional()
  @IsNumber()
  user_id?: number;

  @ApiProperty({
    description:
      'List of User contacts to be created and linked to this Person.',
    type: () => [CreatePersonContactDto],
    example: [
      {
        person_id: 1,
        contact_value: 'carlos@gmail.com',
        contact_type: 'EMAIL',
      },
      {
        person_id: 1,
        contact_value: '+50312345678',
        contact_type: 'PHONE',
      },
    ],
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Transform(({ value }: { value: string }) =>
    plainToInstance(CreatePersonContactDto, JSON.parse(value)),
  )
  @Type(() => CreatePersonContactDto)
  personContact?: CreatePersonContactDto[];
}
