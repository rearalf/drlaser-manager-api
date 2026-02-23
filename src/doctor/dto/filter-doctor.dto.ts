import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

import { PaginationDto } from '@/common/dto/pagination.dto';

export class FilterDoctorDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Search keyword to filter roles by name.',
    example: 'Odontologo',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
