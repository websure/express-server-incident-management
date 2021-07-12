import Container, { Service } from 'typedi';
import { Iincident, IError } from '../../../models';
import IncidentRepository from '../repositories/IncidentRepository';
import IncidentVO from '../domain/IncidentVO';
import { getUSer } from '../../../utils';
import LoggerService from '../../../loaders/Logger';

@Service()
class CreateService {
  #incidentVO: any;
  #logger: LoggerService;
  constructor(private readonly incidentRepository: IncidentRepository) {
    this.#incidentVO = Container.get(IncidentVO);
    this.#logger = Container.get(LoggerService);
  }

  private fetchUser = (token: string | undefined) => {
    if (token) {
      let currUser = getUSer(token);
      return currUser.length > 0 ? currUser[0].userid : '';
    }
    return '';
  };

  async createIncident(
    incident: Iincident,
    token: string | undefined
  ): Promise<Iincident | IError> {
    try {
      let dao: Iincident = incident;
      const created_by = this.fetchUser(token);
      dao = this.#incidentVO.setValues({
        ...incident,
        created_by,
      });
      this.#logger.info('Create Incident, set DAO for DB Insert', {
        component: 'IncidentService',
      });
      const result = await this.incidentRepository.createIncident(dao);
      return result;
    } catch (error: any) {
      throw error;
    }
  }
}

export default CreateService;
