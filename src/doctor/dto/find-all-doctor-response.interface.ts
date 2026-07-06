export interface IDoctorSpecialtyResponse {
  id: number;
  name: string;
  description?: string | null;
}

export interface IDoctorUserDetailResponse {
  id: number;
  email: string;
  created_at: Date;
}

export interface IDoctorPersonDetailResponse {
  id: number;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  profile_picture_name?: string | null;
  profile_picture_url?: string | null;
  user_id?: number | null;
  person_type_id: number;
  created_at: Date;
  user?: IDoctorUserDetailResponse | null;
}

export interface IDoctorSecondarySpecialtyDetailResponse {
  id: number;
  doctor_id: number;
  specialty_id: number;
  created_at: Date;
  specialty: IDoctorSpecialtyResponse;
}

export interface IDoctorByIdResponse {
  id: number;
  person_id: number;
  specialty_id: number;
  qualification?: string | null;
  created_at: Date;
  person: IDoctorPersonDetailResponse;
  primarySpecialty: IDoctorSpecialtyResponse;
  doctorSpecialties: IDoctorSecondarySpecialtyDetailResponse[];
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
