"use client";

export type PhysicalLimitation = 'nyeri_lutut' | 'nyeri_punggung' | 'tidak_ada';
export type MedicalCondition = 'hipertensi' | 'artritis' | 'osteoporosis' | 'tidak_ada';

export interface UserProfile {
  name: string;
  ageRange: string;
  limitations: PhysicalLimitation[];
  medicalConditions: MedicalCondition[];
}

export interface AppState {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
  resetProfile: () => void;
}
