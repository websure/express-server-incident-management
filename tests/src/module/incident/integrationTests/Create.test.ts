import supertest from 'supertest';
import mongoose from 'mongoose';
import { TestServer } from '../../../../TestServerSetup';

const request = supertest(TestServer.getServer());

const CreateIncidentParams = {
  status: 'analysis',
  title: 'running test cases',
  description: '',
  type: 'bug',
  assignee: 'user1',
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

describe('Test Create Incident POST API', () => {
  it('return 401 if user is not admin', () => {
    request
      .post('/api/v1/incident/create')
      .expect(401)
      .then((res) => {
        expect(res.body.msg).toStrictEqual(
          'Only authorized users can access incidents'
        );
      });
  });

  test('create an incident ', async () => {
    const post = await request
      .post('/api/v1/incident/create')
      .send(CreateIncidentParams)
      .set('Authorization', 'df34e.ffrh.mh7u8');

    const { status, title, created_by } = post.body;
    expect(created_by).toEqual('admin');
    expect(status).toEqual('analysis');
    expect(title).toEqual('running test cases');
  });

  test('unauthorized user', async () => {
    await request
      .delete(`/api/v1/incident/abcd`)
      .set('Authorization', 'somewronguser')
      .expect({ msg: 'Only authorized users can access incidents', error: {} });
  });
});
