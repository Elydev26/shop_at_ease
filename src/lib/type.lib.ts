//import { ProfileTypes } from './enums';

export interface AuthTokenPayload {
    userData?: AuthenticatedUserData;
    //profile?: ProfileSummary;
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
    //profileType: ProfileTypes;
    entityProfileId?: string;
  };
  
  export interface PlatformRequest extends Request {
    authPayload: AuthTokenPayload;
  }
  