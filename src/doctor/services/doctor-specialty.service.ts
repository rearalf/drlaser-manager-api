import { EntityManager, In } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { DoctorSpecialty } from '../entities/doctor-specialty.entity';
import { Specialty } from '../entities/specialty.entity';

@Injectable()
export class DoctorSpecialtyService {
  constructor() {}

  async create(
    manager: EntityManager,
    doctor_id: number,
    specialty_ids: number[],
  ): Promise<DoctorSpecialty[]> {
    if (!specialty_ids.length) return [];

    const specialties = await manager.findBy(Specialty, {
      id: In(specialty_ids),
    });

    if (specialties.length !== specialty_ids.length) {
      throw new NotFoundException('No existen una o más especialidades.');
    }

    const existing = await manager.find(DoctorSpecialty, {
      where: {
        doctor_id,
        specialty_id: In(specialty_ids),
      },
      withDeleted: true,
    });

    const toRestore: DoctorSpecialty[] = [];
    const existingActiveIds = new Set<number>();
    const existingDeletedMap = new Map<number, DoctorSpecialty>();

    for (const rel of existing) {
      if (rel.deleted_at) {
        existingDeletedMap.set(rel.specialty_id, rel);
      } else {
        existingActiveIds.add(rel.specialty_id);
      }
    }

    for (const specialty_id of specialty_ids) {
      const deleted = existingDeletedMap.get(specialty_id);
      if (deleted) {
        deleted.deleted_at = null;
        toRestore.push(deleted);
      }
    }

    const toCreate = specialty_ids
      .filter((id) => !existingActiveIds.has(id) && !existingDeletedMap.has(id))
      .map((specialty_id) =>
        manager.create(DoctorSpecialty, {
          doctor_id,
          specialty_id,
        }),
      );

    return manager.save(DoctorSpecialty, [...toRestore, ...toCreate]);
  }
}
