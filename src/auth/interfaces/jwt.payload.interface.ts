export interface JwtPayload {
  _id: string;
  email: string;
  isActive: boolean;
  roles: string[];
  username: string;
}
