/**
 * Generates and returns User VO object
 */
import { Service } from 'typedi';
import { IUser } from '../../../models';

@Service()
class UserVO {
  #userid: string = '';
  #password: string = '';
  #isadmin: boolean = false;
  #token: string = '';

  setValues = (doc: any): IUser => {
    if (doc) {
      this.#userid = doc.userid;
      this.#password = doc.password;
      this.#isadmin = doc.isadmin;
      this.#token = doc.token;
    }
    return this.toJSON();
  };

  toJSON = (): IUser => ({
    userid: this.#userid,
    password: this.#password,
    isadmin: this.#isadmin,
    token: this.#token,
  });
}

export default UserVO;
