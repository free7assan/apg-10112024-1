import { UserModel } from '../database/models/User';
import { comparePasswords } from '../utils/password';

export class AuthService {
  static async login(email: string, password: string): Promise<{
    id: string;
    email: string;
    role: 'admin' | 'user';
  }> {
    try {
      const user = await UserModel.findByEmail(email);
      
      if (!user) {
        throw new Error('Invalid credentials');
      }

      const isValid = await comparePasswords(password, user.password_hash);
      if (!isValid) {
        throw new Error('Invalid credentials');
      }

      return {
        id: user.id.toString(),
        email: user.email,
        role: user.role
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
}