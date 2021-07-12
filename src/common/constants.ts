const STATUS = {
  ANALYSIS: 'analysis',
  INPROGRESS: 'inprogress',
  DONE: 'done',
  CLOSE: 'close',
};

const INCIDENT_TYPE = {
  BUG: 'bug',
  TASK: 'task',
  STORY: 'story',
};

const ORDER_BY = {
  ASC: 'asc',
  DESC: 'desc',
};

const GET_INCIDENT_PARAMS = {
  START_INDEX: 'start_index',
  MAX: 'max',
  SORTBY: 'sortby',
  ORDERBY: 'orderby',
};

const INCIDENT_API_PARAMS = {
  CREATED_BY: 'created_by',
  DESCRIPTION: 'description',
  TITLE: 'title',
  ASSIGNEE: 'assignee',
  ACKNOWLEDGE: 'acknowledge',
  TYPE: 'type',
  CREATED_ON: 'created_on',
  UPDATED_ON: 'updated_on',
  STATUS: 'status',
};

const INCIDENT_AUTH_ERROR = 'Only authorized users can access incidents';

export {
  STATUS,
  INCIDENT_TYPE,
  ORDER_BY,
  GET_INCIDENT_PARAMS,
  INCIDENT_API_PARAMS,
  INCIDENT_AUTH_ERROR,
};
