/**
 * Class to update an incident and activity model
 * All business logic is handled here
 *
 */
import Container, { Service } from 'typedi';
import {
  Iincident,
  IError,
  IActivity,
  IincidentDetailsResponseVO,
} from '../../../models';
import IncidentRepository from '../repositories/IncidentRepository';
import { getUSer } from '../../../utils';
import { generateErrorObj } from '../../../utils';
import ActivityVO from '../domain/ActivityVO';
import { STATUS } from '../../../common/constants';
import Users from '../../../db/users.db';

@Service()
class UpdateService {
  #activityVO: any;
  #activityObj: IActivity;
  #originalIncidentDO: Iincident;
  constructor(private readonly incidentRepository: IncidentRepository) {
    this.#activityVO = Container.get(ActivityVO);
  }

  private fetchUser = (token: string | undefined) => {
    if (token) {
      let currUser = getUSer(token);
      return currUser.length > 0 ? currUser[0].userid : '';
    }
    return '';
  };

  /**
   * validate and update incident model
   * only current user can acknowledge the incident
   * @param {*} req
   * @param {*} res
   * @returns
   */
  private fetchAndValidateIncidentModel = async (
    incident: Iincident,
    token: string
  ) => {
    try {
      let currUserId = this.fetchUser(token);
      const { id = '', acknowledge } = incident;
      const incidentDO = await this.incidentRepository.getIncident(id);

      /**
       * only current user can acknowledge the incident.
       * if unauthorized user acknowledges the incident, will throw error
       */
      if (incidentDO.acknowledge !== acknowledge) {
        if (incidentDO.assignee !== currUserId) {
          //logger.error({ err: 'Only assignee can acknowledge the Incident' });
          throw generateErrorObj('Only assignee can acknowledge the Incident');
        }
      }
      return incidentDO;
    } catch (e) {
      throw e;
    }
  };

  private updateActivityModel = (
    activityModel: IActivity,
    updatedStatus: IActivity['activity'] | [{}],
    updatedAssignee: IActivity['activity'] | [{}]
  ) => {
    this.#activityObj = this.#activityVO.setValues({
      ...activityModel,
      activity: {
        incident_status: updatedStatus,
        incident_assignee: updatedAssignee,
      },
    });
  };

  /**
   * update status and asignee activity
   * @param {*} activityList
   * @param {*} status
   * @param {*} OldStatus
   * @param {*} assignee
   * @param {*} OldAssignee
   * @returns updated status and asignee
   */
  private generateIncidentActivityModel = (
    activityList: IActivity,
    status: string,
    OldStatus: string,
    assignee: string,
    OldAssignee: string
  ) => {
    try {
      const { activity } = activityList;
      let updatedStatus = activity?.incident_status || [{}];
      let updatedAssignee = activity?.incident_assignee || [{}];

      if (status && status !== OldStatus) {
        /* check if status is valid */
        let allowedStatusValues = Object.values(STATUS);
        if (!allowedStatusValues.includes(status))
          throw generateErrorObj('invalid status value');

        if (activity?.incident_status) {
          const lastStatus =
            activity?.incident_status[activity?.incident_status.length - 1];
          updatedStatus.unshift({ from: lastStatus?.to || '', to: status });
        }
      }

      if (assignee && assignee !== OldAssignee) {
        // chekc if user is authorized
        let validUser = Users.filter((user) => user.userid === assignee);
        if (validUser.length === 0) throw generateErrorObj('Unauthorized user');

        if (activity?.incident_assignee) {
          const lastAssignee =
            activity?.incident_assignee[activity?.incident_assignee.length - 1];
          updatedAssignee.unshift({
            from: lastAssignee?.to || '',
            to: assignee,
          });
        }
      }

      return {
        updatedStatus,
        updatedAssignee,
      };
    } catch (e: any) {
      //logger.error({ err: e }, 'Error in updating activity model ');
      throw generateErrorObj('error in generating activity model', e);
    }
  };

  private generateResponseVO = (
    incident: Iincident,
    activitymodel?: IActivity
  ): IincidentDetailsResponseVO => {
    const { created_by, id, created_on, updated_on } = this.#originalIncidentDO;

    return {
      id: incident.id || '',
      incident: {
        ...incident,
        created_by,
        id,
        created_on,
        updated_on,
      },
      activity: activitymodel?.activity,
    };
  };

  private updateIncidentAndActivityModel = async (
    incident: Iincident,
    activity?: IActivity
  ): Promise<IincidentDetailsResponseVO> => {
    const result = await this.incidentRepository.updateIncident(
      incident,
      activity
    );

    return this.generateResponseVO(incident, result);
  };

  async updateIncident(
    dao: Iincident,
    token: string
  ): Promise<IincidentDetailsResponseVO | IError> {
    try {
      const { id, status = '', assignee = '' } = dao;
      if (!id) throw generateErrorObj('Incident document Id is missing');
      // validate params
      this.#originalIncidentDO = await this.fetchAndValidateIncidentModel(
        dao,
        token
      );

      let incidentActivityDO = await this.incidentRepository.getActivity(id);
      const { status: OldStatus = '', assignee: OldAssignee = '' } =
        this.#originalIncidentDO;

      /**
       * update activity only when status,assignee is changed
       */
      if (status !== OldStatus || assignee !== OldAssignee) {
        const { updatedStatus, updatedAssignee } =
          this.generateIncidentActivityModel(
            incidentActivityDO,
            status,
            OldStatus,
            assignee,
            OldAssignee
          );

        this.updateActivityModel(
          incidentActivityDO,
          updatedStatus,
          updatedAssignee
        );
        return this.updateIncidentAndActivityModel(dao, this.#activityObj);
      } else {
        return this.updateIncidentAndActivityModel(dao);
      }
    } catch (error: any) {
      throw error;
    }
  }
}

export default UpdateService;
