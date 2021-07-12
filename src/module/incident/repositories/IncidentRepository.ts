/**
 * Access DB for CRUD operations
 */
import Container, { Service } from 'typedi';
import mongoose, { ClientSession } from 'mongoose';
import { Iincident, IError, IActivity, IincidentListDO } from '../../../models';
import IncidentModel from '../../../db/modelSchemas/IncidentSchema';
import ActivityModel from '../../../db/modelSchemas/ActivitySchema';
import DataAccess from '../../../db/DataAccess';
import IncidentResponseVO from '../domain/IncidentVO';
import ActivityResponseVO from '../domain/ActivityVO';

import { generateErrorObj } from '../../../utils';
import LoggerService from '../../../loaders/Logger';

@Service()
class IncidentRepository {
  #incidentModel: typeof IncidentModel;
  #dataLayer: any;
  #incidentResponseVO: any;
  #activityResponseVO: any;
  #incidentObj: Iincident;
  #activityObj: IActivity;
  #activityModel: typeof ActivityModel;
  #logger: LoggerService;

  constructor() {
    this.#incidentModel = IncidentModel;
    this.#activityModel = ActivityModel;
    this.#dataLayer = Container.get(DataAccess);
    this.#incidentResponseVO = Container.get(IncidentResponseVO);
    this.#activityResponseVO = Container.get(ActivityResponseVO);
    this.#logger = Container.get(LoggerService);
  }

  /**
   * Inserts new incident document
   * @param session
   * @returns
   */
  private insertIncident = async (
    session: ClientSession
  ): Promise<mongoose.Document> => {
    const incidentDoc: any = await this.#incidentModel.create(
      [this.#incidentObj],
      {
        session,
      }
    );
    this.#logger.info(`Incident model created`, {
      component: 'IncidentRepository',
    });
    return incidentDoc;
  };

  /**
   * Inserts Activity document
   * @param session
   * @returns
   */
  private insertActivity = async (
    session: ClientSession
  ): Promise<mongoose.Document> => {
    const activityDoc: any = await this.#activityModel.create(
      [this.#activityObj],
      {
        session,
      }
    );
    this.#logger.info(`Activity model created`, {
      component: 'IncidentRepository',
    });
    return activityDoc;
  };

  private setIncident = (incident: Iincident) => (this.#incidentObj = incident);

  private setActivity = (activity: IActivity) => (this.#activityObj = activity);

  private createActivityDAO = (
    id: string = '',
    status: string = '',
    assignee: string = 'unassigned',
    created_by: string = ''
  ): IActivity => ({
    incident_id: id,
    activity: {
      incident_status: [
        {
          from: '',
          to: status,
        },
      ],
      incident_assignee: [
        {
          from: created_by,
          to: assignee,
        },
      ],
    },
  });

  /**
   * Create Incident and releated new Activity model
   * @param session
   */
  private insertInTransactions = async (session: ClientSession) => {
    this.#logger.info(`Initiating DB inserts `, {
      component: 'IncidentRepository',
    });
    const doc: any = await this.insertIncident(session);
    const incidentDoc: Iincident = this.#incidentResponseVO.setValues(doc[0]);
    this.setIncident(incidentDoc);

    const { id, status, assignee, created_by } = incidentDoc;
    const actObj = this.createActivityDAO(id, status, assignee, created_by);
    this.setActivity(actObj);
    this.#logger.info(`Setting Activity VO `, {
      component: 'IncidentRepository',
    });
    await this.insertActivity(session);
  };

  /**
   * Access Data Access layer to insert incident, activity in DB session
   * @param incident
   * @returns
   */
  async createIncident(incident: Iincident): Promise<Iincident | IError> {
    try {
      this.setIncident(incident);
      await this.#dataLayer.createSession(
        async (session: ClientSession) =>
          await this.insertInTransactions(session)
      );
      return this.#incidentObj;
    } catch (error: any) {
      throw generateErrorObj('DB error in creating Incident', error);
    }
  }

  /**
   * Access Data Access layer to Return list of incident
   * @param dao
   * @returns
   */
  async getIncidentList(dao: IincidentListDO): Promise<Iincident[] | IError> {
    try {
      const { filterby = [{}], max, start_index, sortStr } = dao;
      this.#logger.info(`Fetch incident list `, {
        component: 'IncidentRepository',
      });
      const doc = await this.#dataLayer.createSession(
        async (session: ClientSession) =>
          await this.#incidentModel
            .find(filterby[0])
            .limit(max)
            .skip(start_index)
            .sort(sortStr)
            .session(session)
            .exec()
      );

      return doc.map((incident: Iincident) =>
        this.#incidentResponseVO.setValues(incident)
      );
    } catch (error: any) {
      throw generateErrorObj('DB error in fetching incident list ', error);
    }
  }

  /**
   * Access Data Access layer to Return incident details
   * @param id
   * @returns
   */
  async getIncidentDetails(
    id: string
  ): Promise<[Iincident, IActivity] | IError> {
    try {
      this.#logger.info(`Fetch incident details : ${id} `, {
        component: 'IncidentRepository',
      });
      await this.#dataLayer.createSession(async (session: ClientSession) => {
        const doc: any = await this.#incidentModel
          .findOne({ id })
          .session(session)
          .exec();
        if (!doc)
          throw { details: 'No incident document found with id : ' + id };
        const incidentDoc: Iincident = this.#incidentResponseVO.setValues(doc);
        this.setIncident(incidentDoc);

        const incidentActivityModel: IActivity = await this.#activityModel
          .findOne({
            incident_id: id,
          })
          .session(session)
          .exec();

        if (!incidentActivityModel)
          throw { details: 'No activity document found with id : ' + id };
        const activityDoc: IActivity = this.#activityResponseVO.setValues(
          incidentActivityModel
        );
        this.setActivity(activityDoc);
      });
      return [this.#incidentObj, this.#activityObj];
    } catch (error: any) {
      throw generateErrorObj('DB error in fetch Incident details ', error);
    }
  }

  /**
   * Access Data Access layer to deleta an incident and its related Activity
   * @param id
   * @returns
   */
  async deleteIncident(id: string): Promise<string | IError> {
    this.#logger.info(
      `Delete incident doc and related activity for id : ${id} `,
      {
        component: 'IncidentRepository',
      }
    );
    try {
      await this.#dataLayer.createSession(async (session: ClientSession) => {
        await this.#incidentModel.deleteOne({ id }).session(session).exec();
        await this.#activityModel
          .findOneAndDelete({
            incident_id: id,
          })
          .session(session)
          .exec();
      });
      return 'Incident and its activity deleted successfully';
    } catch (error: any) {
      throw generateErrorObj('DB error in fetch Incident details ', error);
    }
  }

  async getIncident(id: string): Promise<Iincident> {
    this.#logger.info(`Get incident doc for id : ${id} `, {
      component: 'IncidentRepository',
    });
    try {
      await this.#dataLayer.createSession(async (session: ClientSession) => {
        const doc = await this.#incidentModel
          .findOne({ id })
          .session(session)
          .exec();
        if (!doc) throw { details: `No incident found with id : ${id}` };
        const val: Iincident = this.#incidentResponseVO.setValues(doc);
        this.setIncident(val);
      });
      return this.#incidentObj;
    } catch (error: any) {
      throw generateErrorObj('DB error in fetching Incident ', error);
    }
  }

  async getActivity(id: string): Promise<IActivity> {
    this.#logger.info(`Get activity doc for id : ${id} `, {
      component: 'IncidentRepository',
    });
    try {
      await this.#dataLayer.createSession(async (session: ClientSession) => {
        const doc = await this.#activityModel
          .findOne({ incident_id: id })
          .session(session)
          .exec();
        if (!doc) throw { details: `No activity found with id : ${id}` };
        const val: IActivity = this.#activityResponseVO.setValues(doc);
        this.setActivity(val);
      });
      return this.#activityObj;
    } catch (error: any) {
      throw generateErrorObj('DB error in fetching Activity ', error);
    }
  }

  /**
   * Access Data Access layer to updates an incident and activity
   * @param incident
   * @param activitymodel
   * @returns
   */
  async updateIncident(
    incident: Iincident,
    activitymodel?: IActivity
  ): Promise<IActivity> {
    try {
      const { description, status, type, title, assignee, acknowledge, id } =
        incident;
      this.#logger.info(
        `Update incident doc for incident id : ${id} and its activity`,
        {
          component: 'IncidentRepository',
        }
      );
      await this.#dataLayer.createSession(async (session: ClientSession) => {
        if (activitymodel) {
          const doc = await this.#activityModel
            .findOneAndUpdate(
              { incident_id: id },
              {
                activity: activitymodel?.activity,
              },
              { new: true }
            )
            .session(session);
          if (!doc) throw { details: `No activity found with id : ${id}` };
          this.setActivity(this.#activityResponseVO.setValues(doc));
        }

        await this.#incidentModel
          .updateOne(
            { id },
            { description, status, type, title, assignee, acknowledge }
          )
          .session(session)
          .exec();
      });
      return this.#activityObj;
    } catch (error: any) {
      throw generateErrorObj('DB error in fetching Activity ', error);
    }
  }
}

export default IncidentRepository;
