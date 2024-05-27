
export interface AuthTokenPayload {
  userData?: AuthenticatedUserData;
  exp?: number | unknown;
}

export interface AuthenticatedUserData {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  //phone: string;
}

export type ProfileSummary = {
  id: string;
  profileTypeId: string;
  entityProfileId?: string;
};

export interface PlatformRequest extends Request {
  authPayload: AuthTokenPayload;
}
