/**
 * Access DB for CRUD operations
 */
import Container, { Service } from 'typedi';
import { IUser, IError } from '../../../models';
import { generateErrorObj } from '../../../utils';
import Users from '../../../db/users.db';
import LoggerService from '../../../loaders/Logger';

@Service()
class UserRepository {
  #userObj: IUser;
  #logger: LoggerService;

  constructor() {
    this.#logger = Container.get(LoggerService);
  }

  #setUserObj = (user: IUser) => (this.#userObj = user);

  /**
   * TODO : replace this mock service with DB
   * Fetch User from Mock DB
   * @param userid
   * @param password
   */
  private getUserFromMockDB = (userid: string, password: string) => {
    let user = Users.filter(
      (user) => user.userid === userid && user.password === password
    );
    if (user.length == 1) {
      this.#logger.info('user is fetched from mock DB', {
        component: 'UserRepository',
      });
      this.#setUserObj(user[0]);
    } else {
      throw generateErrorObj('Only authorized users can access incidents ');
    }
  };

  /**
   * Fetch USer details from DB
   * @param userid
   * @param password
   * @returns USerVO
   */
  async getUser(userid: string, password: string): Promise<IUser | IError> {
    try {
      this.getUserFromMockDB(userid, password);
      return this.#userObj;
    } catch (error: any) {
      this.#logger.info('Error in fetching user from mock DB', {
        component: 'UserRepository',
      });
      throw error;
    }
  }
}

export default UserRepository;
