import express, { Router } from 'express';
import Container from 'typedi';
import IncidentController from './controller/IncidentController';
import { isAdmin, ValidateDataMiddleware } from './middleware';
import {
  IncidentDataValidationSchema,
  GetIncidentListApiParamsSchema,
} from './validation';
const routes = new (Router as any)();

const incidentController = Container.get(IncidentController);

// create an incident
routes.post(
  '/create',
  isAdmin,
  ValidateDataMiddleware(IncidentDataValidationSchema),
  (req: express.Request, res: express.Response) =>
    incidentController.createIncident(req, res)
);

// Get incident lists
routes.post(
  '/',
  ValidateDataMiddleware(GetIncidentListApiParamsSchema),
  (req: express.Request, res: express.Response) =>
    incidentController.getIncidentList(req, res)
);

//get an incident details
routes.get('/:id', (req: express.Request, res: express.Response) =>
  incidentController.getIncidentDetails(req, res)
);

//delete an incident, its activity
routes.delete('/:id', isAdmin, (req: express.Request, res: express.Response) =>
  incidentController.deleteIncident(req, res)
);

//update an incident
routes.put(
  '/:id',
  ValidateDataMiddleware(IncidentDataValidationSchema),
  (req: express.Request, res: express.Response) =>
    incidentController.updateIncident(req, res)
);

export default routes;
