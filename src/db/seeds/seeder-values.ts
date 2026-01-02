import { IBasicSeeds, IPermissions } from './interface';

import { PERMISSIONS_ENUM, TABLES_ENUM } from '@/common/enums/permission.enum';

export const personTypeSeeds: IBasicSeeds[] = [
  {
    id: 1,
    name: 'Administrador',
    description: 'Persona con permisos administrativos generales.',
  },
  {
    id: 2,
    name: 'Recepcionista',
    description: 'Persona que agenda citas y gestiona la clínica.',
  },
  {
    id: 3,
    name: 'Asistente Dental',
    description: 'Persona que asiste al profesional de salud.',
  },
  {
    id: 4,
    name: 'Doctor',
    description: 'Profesional de la salud que atiende a los pacientes.',
  },
  {
    id: 5,
    name: 'Paciente',
    description: 'Persona que recibe tratamiento en la clínica.',
  },
];

export const permissionSeeds: IPermissions[] = [
  // DOCTOR (Grupo padre)
  {
    id: 1,
    name: 'GROUP_DOCTOR',
    description: 'Agrupa todos los permisos relacionados con doctores',
    label: 'Permisos de doctores',
    parentId: null,
  },
  {
    id: 2,
    name: `${PERMISSIONS_ENUM.CREATE}_${TABLES_ENUM.DOCTOR}`,
    description: 'Permite crear doctores',
    label: 'Crear doctores',
    parentId: 1,
  },
  {
    id: 3,
    name: `${PERMISSIONS_ENUM.VIEW_ONE}_${TABLES_ENUM.DOCTOR}`,
    description: 'Permite consultar un perfil de doctor',
    label: 'Ver perfil de doctor',
    parentId: 1,
  },
  {
    id: 4,
    name: `${PERMISSIONS_ENUM.VIEW_ALL}_${TABLES_ENUM.DOCTOR}`,
    description: 'Permite consultar todos los doctores',
    label: 'Ver todos los doctores',
    parentId: 1,
  },
  {
    id: 5,
    name: `${PERMISSIONS_ENUM.UPDATE}_${TABLES_ENUM.DOCTOR}`,
    description: 'Permite actualizar doctores',
    label: 'Actualizar doctores',
    parentId: 1,
  },
  {
    id: 6,
    name: `${PERMISSIONS_ENUM.DELETE}_${TABLES_ENUM.DOCTOR}`,
    description: 'Permite eliminar doctores',
    label: 'Eliminar doctores',
    parentId: 1,
  },

  // ROLE (Grupo padre)
  {
    id: 7,
    name: 'GROUP_ROLE',
    description: 'Agrupa todos los permisos relacionados con roles',
    label: 'Permisos de roles',
    parentId: null,
  },
  {
    id: 8,
    name: `${PERMISSIONS_ENUM.CREATE}_${TABLES_ENUM.ROLE}`,
    description: 'Permite crear roles',
    label: 'Crear roles',
    parentId: 7,
  },
  {
    id: 9,
    name: `${PERMISSIONS_ENUM.VIEW_ONE}_${TABLES_ENUM.ROLE}`,
    description: 'Permite consultar un perfil de rol',
    label: 'Ver perfil de rol',
    parentId: 7,
  },
  {
    id: 10,
    name: `${PERMISSIONS_ENUM.VIEW_ALL}_${TABLES_ENUM.ROLE}`,
    description: 'Permite consultar todos los roles',
    label: 'Ver todos los roles',
    parentId: 7,
  },
  {
    id: 11,
    name: `${PERMISSIONS_ENUM.UPDATE}_${TABLES_ENUM.ROLE}`,
    description: 'Permite actualizar roles',
    label: 'Actualizar roles',
    parentId: 7,
  },
  {
    id: 12,
    name: `${PERMISSIONS_ENUM.DELETE}_${TABLES_ENUM.ROLE}`,
    description: 'Permite eliminar roles',
    label: 'Eliminar roles',
    parentId: 7,
  },
];
