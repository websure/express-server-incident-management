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

describe('Test Delete Api', () => {
  test('return 401 if user is not admin', (done) => {
    request
      .delete('/api/v1/incident/60afb08fa32420609c98ccb5')
      .expect({
        error: {},
        msg: 'Only authorized users can access incidents',
      })
      .expect(401, done);
  });

  test('create and delete an valid incident ', async () => {
    const post = await request
      .post('/api/v1/incident/create')
      .send(CreateIncidentParams)
      .set('Authorization', 'df34e.ffrh.mh7u8');
    await request
      .delete(`/api/v1/incident/${post.body.id}`)
      .set('Authorization', 'df34e.ffrh.mh7u8')
      .expect({
        id: post.body.id,
        msg: 'Incident and its activity deleted successfully',
      });
  });

  test('delete an invalid incident id', async () => {
    await request
      .delete(`/api/v1/incident/abcd`)
      .set('Authorization', 'df34e.ffrh.mh7u8')
      .then((res) => {
        expect(res.body.msg).toStrictEqual(
          'DB error in fetch Incident details '
        );
      });
  });
});
