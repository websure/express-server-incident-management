/**
 * Return incident details response object
 * Handles VO from Data access layer and generates response VO
 */
import { Service } from 'typedi';
import {
  Iincident,
  IError,
  IActivity,
  IincidentDetailsResponseVO,
} from '../../../models';
import IncidentRepository from '../repositories/IncidentRepository';

@Service()
class GetIncidentDetailsService {
  constructor(private readonly incidentRepository: IncidentRepository) {}

  private generateResponseVO = (
    result: [Iincident, IActivity]
  ): IincidentDetailsResponseVO => {
    const [incident, incidentActivityModel] = result;
    return {
      id: incident.id || '',
      incident,
      activity: incidentActivityModel.activity,
    };
  };

  async getIncidentDetails(
    id: string
  ): Promise<IincidentDetailsResponseVO | IError> {
    try {
      const result: any = await this.incidentRepository.getIncidentDetails(id);
      return this.generateResponseVO(result);
    } catch (error: any) {
      throw error;
    }
  }
}

export default GetIncidentDetailsService;
