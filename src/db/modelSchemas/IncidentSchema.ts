import mongoose, { Schema } from 'mongoose';
import { STATUS, INCIDENT_TYPE } from '../../common/constants';

const IncidentSchema = new Schema(
  {
    id: {
      type: mongoose.Types.ObjectId,
      unique: true,
    },
    created_by: {
      type: String,
      required: [true, 'created_by is missing'],
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: [STATUS.ANALYSIS, STATUS.CLOSE, STATUS.DONE, STATUS.INPROGRESS],
      default: STATUS.ANALYSIS,
    },
    title: {
      type: String,
      required: [true, 'incident Title is missing'],
    },
    assignee: {
      type: String,
      default: '',
    },
    acknowledge: {
      type: String,
      enum: [true, false],
      default: false,
    },
    type: {
      type: String,
      enum: [INCIDENT_TYPE.BUG, INCIDENT_TYPE.STORY, INCIDENT_TYPE.TASK],
      required: [true, 'incident Assignee is missing'],
    },
  },
  {
    timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' },
  }
);

IncidentSchema.pre('save', function () {
  if (this.isNew) {
    this.id = this._id;
  }
});

export default mongoose.model('incident', IncidentSchema);
