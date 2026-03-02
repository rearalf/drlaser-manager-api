export interface IDoctorSpecialtyResponse {
  id: number;
  name: string;
  description?: string | null;
}

export interface IDoctorListItemResponse {
  id: number;
  qualification?: string | null;
  primarySpecialty: IDoctorSpecialtyResponse;
  person_id: number;
  full_name: string;
  profile_picture_url?: string | null;
  profile_picture_name?: string | null;
  user_id?: number | null;
  email?: string | null;
}
