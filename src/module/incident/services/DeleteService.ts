/**
 * Deletes and incident and its activit model
 */
import { Service } from 'typedi';
import { IincidentDeleteResponseVO, IError } from '../../../models';
import IncidentRepository from '../repositories/IncidentRepository';

@Service()
class DeleteService {
  constructor(private readonly incidentRepository: IncidentRepository) {}

  private generateResponseVO = (
    id: string,
    result: string
  ): IincidentDeleteResponseVO => {
    return {
      id,
      msg: result,
    };
  };

  async deleteIncident(
    id: string
  ): Promise<IincidentDeleteResponseVO | IError> {
    try {
      const result: any = await this.incidentRepository.deleteIncident(id);
      return this.generateResponseVO(id, result);
    } catch (error: any) {
      throw error;
    }
  }
}

export default DeleteService;
