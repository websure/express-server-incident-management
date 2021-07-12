/**
 * All incident endpoints are handled here
 * Generates Data access objects and passes to services
 * return Response / error
 */
import { Request, Response } from 'express';
import Container, { Service } from 'typedi';
import IncidentVO from '../domain/IncidentVO';
import { Iincident, IincidentListDO } from '../../../models';
import CreateService from '../services/CreateService';
import GetListService from '../services/GetListService';
import GetIncidentDetailsService from '../services/GetIncidentDetailsService';
import IncidentListDO from '../domain/IncidentListDO';
import DeleteService from '../services/DeleteService';
import UpdateService from '../services/UpdateService';
import LoggerService from '../../../loaders/Logger';

@Service()
class IncidentController {
  // response objects
  #incidentVO: any;
  // data access objects
  #incidentListDO: any;
  // logging services
  #logger: LoggerService;

  constructor(
    private readonly createService: CreateService,
    private readonly getListService: GetListService,
    private readonly getIncidentDetailsService: GetIncidentDetailsService,
    private readonly deleteService: DeleteService,
    private readonly UpdateService: UpdateService
  ) {
    this.#incidentVO = Container.get(IncidentVO);
    this.#incidentListDO = Container.get(IncidentListDO);
    this.#logger = Container.get(LoggerService);
  }

  async createIncident(req: Request, res: Response) {
    try {
      const DO: Iincident = this.#incidentVO.setValues(req.body);
      const token = req.headers['authorization'];
      this.#logger.info('Create Incident', {
        component: 'IncidentController',
      });

      const result = await this.createService.createIncident(DO, token);
      return res.status(201).json(result);
    } catch (e) {
      return res.status(500).json(e);
    }
  }

  async getIncidentList(req: Request, res: Response) {
    try {
      const dao: IincidentListDO = this.#incidentListDO.setValues(req.body);
      const result = await this.getListService.getList(dao);
      return res.status(201).json(result);
    } catch (e) {
      return res.status(500).json(e);
    }
  }

  async getIncidentDetails(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await this.getIncidentDetailsService.getIncidentDetails(
        id
      );
      return res.status(201).json(result);
    } catch (e) {
      return res.status(500).json(e);
    }
  }

  async deleteIncident(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await this.deleteService.deleteIncident(id);
      return res.status(201).json(result);
    } catch (e) {
      return res.status(500).json(e);
    }
  }

  async updateIncident(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (req.body && Object.keys(req.body).length > 0) {
        const dao: Iincident = this.#incidentVO.setValues({
          ...req.body,
          _id: id,
        });
        const token = req.headers['authorization'] || '';

        const result = await this.UpdateService.updateIncident(dao, token);
        return res.status(201).json(result);
      }
      throw 'missing incident details';
    } catch (e) {
      return res.status(500).json(e);
    }
  }
}

export default IncidentController;
