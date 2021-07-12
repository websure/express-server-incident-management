import { Request, Response } from 'express';
import Container, { Service } from 'typedi';
import LoggerService from '../../../loaders/Logger';
import UserService from '../services/UserService';

@Service()
class UserController {
  #logger: LoggerService;

  constructor(private readonly userService: UserService) {
    this.#logger = Container.get(LoggerService);
  }

  async login(req: Request, res: Response) {
    try {
      /* user login : params -> email,password */
      const { userid, password } = req.body;
      this.#logger.info('Login service called', {
        component: 'UserController',
      });
      const result = await this.userService.getUser(userid, password);
      return res.status(200).json(result);
    } catch (e) {
      return res.status(500).json(e);
    }
  }
}

export default UserController;
