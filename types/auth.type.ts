export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
  userData: {
    email: string;
    name: string;
    role: string;
    status: string;
  };
}
