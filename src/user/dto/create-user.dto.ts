import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  Matches,
  IsEmail,
  IsNumber,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Hashedpassword123',
    description: 'Password of the user (hashed)',
  })
  @MinLength(8, {
    message: 'La contraseña debe tener al menos 8 caracteres.',
  })
  @MaxLength(40, {
    message: 'La contraseña no debe tener más de 40 caracteres.',
  })
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'La contraseña debe tener mayúsculas, minúsculas y números.',
  })
  password: string;

  @ApiProperty({
    example: [1, 2, 3],
    description: 'It is the roles ids',
    type: [Number],
  })
  @Transform(({ value }: { value: string }) => {
    return value.split(',').map(Number);
  })
  @IsArray({ message: 'Los roles no son validos.' })
  @IsNumber({}, { each: true, message: 'Los roles no es valido.' })
  role_ids: number[];
}
