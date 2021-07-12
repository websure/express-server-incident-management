import joi from 'joi';
import {
  INCIDENT_TYPE,
  STATUS,
  ORDER_BY,
  INCIDENT_API_PARAMS,
} from '../../../common/constants';

// const ObjectIDSchemaValidation = JOID.object({
//   id: JOID.objectId(),
// });

const IncidentDataValidationSchema = joi.object().keys({
  status: joi
    .string()
    .valid(STATUS.ANALYSIS, STATUS.CLOSE, STATUS.DONE, STATUS.INPROGRESS),
  title: joi.string().max(200).required(),
  description: joi.string().max(1000).allow('').optional(),
  acknowledge: joi.boolean().optional(),
  type: joi
    .string()
    .valid(INCIDENT_TYPE.BUG, INCIDENT_TYPE.STORY, INCIDENT_TYPE.TASK)
    .required(),
  assignee: joi.string().allow('').optional(),
  created_by: joi.string().allow('').optional(),
});

const GetIncidentListApiParamsSchema = joi.object().keys({
  start_index: joi.number(),
  max: joi.number(),
  sortby: joi
    .string()
    .valid(
      INCIDENT_API_PARAMS.CREATED_BY,
      INCIDENT_API_PARAMS.DESCRIPTION,
      INCIDENT_API_PARAMS.STATUS,
      INCIDENT_API_PARAMS.TITLE,
      INCIDENT_API_PARAMS.ASSIGNEE,
      INCIDENT_API_PARAMS.ACKNOWLEDGE,
      INCIDENT_API_PARAMS.TYPE,
      INCIDENT_API_PARAMS.CREATED_ON,
      INCIDENT_API_PARAMS.UPDATED_ON
    ),
  orderby: joi.string().valid(ORDER_BY.ASC, ORDER_BY.DESC),
  filterby: joi
    .array()
    .items(
      joi.object({
        assignee: joi.string(),
        acknowledge: joi.boolean(),
        status: joi
          .string()
          .valid(STATUS.ANALYSIS, STATUS.CLOSE, STATUS.DONE, STATUS.INPROGRESS),
        type: joi
          .string()
          .valid(INCIDENT_TYPE.BUG, INCIDENT_TYPE.STORY, INCIDENT_TYPE.TASK),
      })
    )
    .allow(null),
});

const updateIncidentListApiParamsSchema = joi.object().keys({
  created_on: joi.string(),
  updated_on: joi.string(),
  activity: joi.array().items(
    joi.object({
      incident_status: joi.array().items(
        joi.object({
          timestamp: joi.string(),
          from: joi.string(),
          to: joi.string(),
        })
      ),
      incident_assignee: joi.array().items(
        joi.object({
          timestamp: joi.string(),
          from: joi.string(),
          to: joi.string(),
        })
      ),
    })
  ),
});

export {
  IncidentDataValidationSchema,
  GetIncidentListApiParamsSchema,
  updateIncidentListApiParamsSchema,
  //ObjectIDSchemaValidation,
};
