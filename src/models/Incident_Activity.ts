interface Iincident {
  id?: string;
  created_by?: string;
  description?: string;
  status?: string;
  title: string;
  assignee?: string;
  acknowledge?: Boolean;
  type: string;
  created_on?: string;
  updated_on?: string;
}

interface IActivity {
  id?: string;
  incident_id: string;
  created_on?: string;
  updated_on?: string;
  activity?: {
    incident_status?: [
      {
        timestamp?: string;
        from: string;
        to: string;
      }
    ];
    incident_assignee?: [
      {
        timestamp?: string;
        from: string;
        to: string;
      }
    ];
  };
}

interface ISortStr {
  [key: string]: string;
}

interface IincidentListDO {
  start_index?: number;
  max?: number;
  sortby?: string;
  orderby?: string;
  filterby?: any;
  sortStr?: ISortStr;
}

interface IincidentDetailsResponseVO {
  id: string;
  incident: Iincident;
  activity: IActivity['activity'];
}

interface IincidentDeleteResponseVO {
  id: string;
  msg: string;
}

export {
  Iincident,
  IActivity,
  IincidentListDO,
  ISortStr,
  IincidentDetailsResponseVO,
  IincidentDeleteResponseVO,
};
