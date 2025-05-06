export enum Role {
  SUPER_ADMIN = "super-admin",
  ADMIN = "admin",
  USER = "user",
}

export type Profile = {
  id: string;
  email: string;
  role: Role;
  first_name: string;
  last_name: string;
  email_verified: boolean;
  photo: string;
  company: string;
  country: string;
  isOnBoarded: boolean;
  fcm_tokens: string[];
};

export type ProfileUpdate = {
  first_name: string;
  last_name: string;
  photo: string;
  company: string;
  country: string;
  isOnBoarded: string;
  fcm_token: string;
};
