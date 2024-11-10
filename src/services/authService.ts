import { UserModel } from '../models/UserModel';

export async function authenticateUser(email: string, password: string) {
  const user = await UserModel.authenticate(email, password);
  
  if (!user) {
    throw new Error('Invalid email or password');
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role
  };
}