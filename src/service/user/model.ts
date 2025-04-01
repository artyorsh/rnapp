export interface IUser {
  id: string;
  name: string;
}

export interface IUserService {
  getUser(): IUser;
}
