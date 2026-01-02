export interface IBasicSeeds {
  id: number;
  name: string;
  description: string;
}

export interface IPermissions extends IBasicSeeds {
  label: string;
  parentId?: number | null;
}
