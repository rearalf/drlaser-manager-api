import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager, In } from 'typeorm';

import { Specialty } from '../entities/specialty.entity';

@Injectable()
export class SpecialtyService {
  constructor() {}

  async validateIds(manager: EntityManager, ids: number[]): Promise<void> {
    if (!ids.length) return;

    const uniqueIds = [...new Set(ids)];

    const found = await manager.findBy(Specialty, {
      id: In(uniqueIds),
    });

    if (found.length !== uniqueIds.length) {
      throw new NotFoundException('No existen una o más especialidades.');
    }
  }
}
