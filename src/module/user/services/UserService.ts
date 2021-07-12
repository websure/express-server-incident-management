/**
 * Controller to handle all user endpoints
 * Generates DAO objects and returns VO or throw error
 */
import { Service } from 'typedi';
import { IUser, IError } from '../../../models';
import UserRepository from '../repositories/UserRepository';

@Service()
class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  /**
   * Return USer object
   * @param userid
   * @param password
   * @returns USer
   */
  async getUser(userid: string, password: string): Promise<IUser | IError> {
    try {
      const result = await this.userRepository.getUser(userid, password);
      return result;
    } catch (error: any) {
      throw error;
    }
  }
}

export default UserService;
