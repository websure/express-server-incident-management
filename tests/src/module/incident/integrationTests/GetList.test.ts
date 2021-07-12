import supertest from 'supertest';
import mongoose from 'mongoose';
import { TestServer } from '../../../../TestServerSetup';

const request = supertest(TestServer.getServer());
const AdminToken = 'df34e.ffrh.mh7u8';
const GetIncidentListParams = {
  start_index: 0,
  max: 5,
  sortby: 'created_on',
  orderby: 'desc',
};

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

describe('Test Get list Api', () => {
  it('unauthorized user', async () => {
    request
      .post(`/api/v1/incident/`)
      .send(GetIncidentListParams)
      .set('Authorization', 'somewronguser')
      .expect({ msg: 'Only authorized users can access incidents', error: {} })
      .expect(401);
  });

  test('create and get incident List', async () => {
    await request
      .post('/api/v1/incident/create')
      .send(CreateIncidentParams)
      .set('Authorization', AdminToken);

    let list = await request
      .post('/api/v1/incident/')
      .send(GetIncidentListParams)
      .set('Authorization', AdminToken);

    expect(list.body.length).toBe(1);
  });

  test('Get list - invalid Params error ', async () => {
    await request
      .post('/api/v1/incident/')
      .send({ ...GetIncidentListParams, invalid: 'idontknow' })
      .set('Authorization', AdminToken)
      .expect({
        msg: 'Invalid Incident Object',
        error: '"invalid" is not allowed',
      })
      .expect(422);
  });
});
