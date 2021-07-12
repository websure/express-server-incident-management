import mongoose, { Schema } from 'mongoose';

const IncidentActivitySchema = new Schema(
  {
    id: {
      type: mongoose.Types.ObjectId,
      unique: true,
    },
    incident_id: {
      type: String,
      required: [true, 'Incident Id is missing'],
    },
    activity: {
      incident_status: [
        {
          _id: false,
          timestamp: {
            type: Date,
            default: Date.now,
          },
          from: {
            type: String,
          },
          to: {
            type: String,
          },
        },
      ],
      incident_assignee: [
        {
          _id: false,
          timestamp: {
            type: Date,
            default: Date.now,
          },
          from: {
            type: String,
          },
          to: {
            type: String,
          },
        },
      ],
    },
  },
  {
    timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' },
  }
);

IncidentActivitySchema.pre('save', function () {
  if (this.isNew) {
    this.id = this._id;
  }
});

export default mongoose.model('activity', IncidentActivitySchema);
