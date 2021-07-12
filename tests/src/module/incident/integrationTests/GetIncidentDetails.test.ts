import supertest from 'supertest';
import mongoose from 'mongoose';
import { TestServer } from '../../../../TestServerSetup';

const request = supertest(TestServer.getServer());
const AdminToken = 'df34e.ffrh.mh7u8';

const CreateIncidentParams = {
  status: 'analysis',
  title: 'running test cases',
  description: '',
  type: 'bug',
  assignee: 'admin',
  created_by: '',
};

beforeEach((done) => {
  mongoose.connect(
    'mongodb://suresh-jain:27017,suresh-jain:27018,suresh-jain:27019/user-management-test',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      replicaSet: 'rs',
    },
    () => done()
  );
});

afterEach((done) => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done());
  });
});

describe('Test Get incident Details Api', () => {
  it('unauthorized user', async () => {
    const Post = await request
      .post('/api/v1/incident/create')
      .send(CreateIncidentParams)
      .set('Authorization', AdminToken);

    const { id } = Post.body;

    request
      .get(`/api/v1/incident/${id}`)
      .set('Authorization', 'somewronguser')
      .expect({ msg: 'Only authorized users can access incidents', error: {} })
      .expect(401);
  });

  test('create and get incident detail', async () => {
    const Post = await request
      .post('/api/v1/incident/create')
      .send(CreateIncidentParams)
      .set('Authorization', AdminToken);

    const { id } = Post.body;

    let detail = await request
      .get(`/api/v1/incident/${id}`)
      .set('Authorization', AdminToken);
    const { id: detail_Id, incident: detail_incident, activity } = detail.body;
    expect(detail_Id).toBe(id);
    expect(activity.incident_status.length).toEqual(1);
    expect(activity.incident_assignee.length).toEqual(1);
    expect(detail_incident.acknowledge).toBe('false');
  });
});
