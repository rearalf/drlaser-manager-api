export class RoleWithPermissionsDto {
  id: number;
  name: string;
  description: string;
  permission: number[];
  permissionsGroup: {
    id: number;
    name: string;
    label: string;
    description: string;
    children: {
      id: number;
      name: string;
      label: string;
      description: string;
    }[];
  }[];
}

export class PermissionGroupDto {
  id: number;
  name: string;
  label: string;
  description: string;
  children: Array<{
    id: number;
    name: string;
    label: string;
    description: string;
  }>;
}
