/**
 * Return list of incident based on params
 */
import { Service } from 'typedi';
import { Iincident, IError, IincidentListDO } from '../../../models';
import IncidentRepository from '../repositories/IncidentRepository';

@Service()
class GetListService {
  constructor(private readonly incidentRepository: IncidentRepository) {}

  async getList(dao: IincidentListDO): Promise<Iincident[] | IError> {
    try {
      const result = await this.incidentRepository.getIncidentList(dao);
      return result;
    } catch (error: any) {
      throw error;
    }
  }
}

export default GetListService;
