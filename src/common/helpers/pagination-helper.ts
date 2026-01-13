import { SelectQueryBuilder, ObjectLiteral } from 'typeorm';
import { PaginationDto } from '../dto/pagination.dto';
import { Response } from 'express';

export class PaginationHelper {
  static paginate<T extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<T>,
    page: number = 1,
    limit: number = 10,
  ): { limit: number; page: number } {
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);
    return {
      limit,
      page,
    };
  }

  static setHeaders(
    res: Response,
    total: number,
    paginationDto: PaginationDto,
  ): void {
    const { pagination, page = 1, per_page: perPage = 10 } = paginationDto;

    if (!pagination) return;

    res.set({
      total_count: total,
      total_pages: Math.ceil(total / perPage),
      page,
      per_page: perPage,
    });
  }
}
