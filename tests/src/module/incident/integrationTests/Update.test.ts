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

let UpdateIncidentParams = {
  description: 'desx',
  status: 'inprogress',
  title: 'updating 2nd incident',
  assignee: 'admin',
  type: 'bug',
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

describe('Test Update Api', () => {
  it('unauthorized user', async () => {
    let Post = await request
      .post('/api/v1/incident/create')
      .send(CreateIncidentParams)
      .set('Authorization', AdminToken);

    request
      .put(`/api/v1/incident/${Post.body.id}`)
      .send(UpdateIncidentParams)
      .set('Authorization', 'somewronguser')
      .expect({ msg: 'Only authorized users can access incidents', error: {} })
      .expect(401);
  });

  test('invalid update params user', async () => {
    let Post = await request
      .post('/api/v1/incident/create')
      .send(CreateIncidentParams)
      .set('Authorization', AdminToken);

    let invalidObj: any = { ...UpdateIncidentParams };
    invalidObj['invalidPropr'] = 'junk value';
    await request
      .put(`/api/v1/incident/${Post.body.id}`)
      .send(invalidObj)
      .set('Authorization', AdminToken)
      .expect({
        msg: 'Invalid Incident Object',
        error: '"invalidPropr" is not allowed',
      });
  });

  test('acknowledge error on incident Update ', async () => {
    let Post = await request
      .post('/api/v1/incident/create')
      .send(CreateIncidentParams)
      .set('Authorization', AdminToken);

    let ackObj = {
      ...UpdateIncidentParams,
      title: 'updating Title test',
      acknowledge: false,
    };

    const User1_Token = 'abdgc.uyih.khi7y';
    await request
      .put(`/api/v1/incident/${Post.body.id}`)
      .send(ackObj)
      .set('Authorization', User1_Token)
      .expect({
        msg: 'Only assignee can acknowledge the Incident',
        error: {},
      });
  });

  test('incident Update ', async () => {
    let Post = await request
      .post('/api/v1/incident/create')
      .send(CreateIncidentParams)
      .set('Authorization', AdminToken);
    const { type, status } = Post.body;

    let UpdateObj = await request
      .put(`/api/v1/incident/${Post.body.id}`)
      .send({ status, type, title: 'updating Title test' })
      .set('Authorization', AdminToken);

    const { incident } = UpdateObj.body;
    const { status: newStatus, title: newTitle, created_by } = incident;
    expect(created_by).toEqual('admin');
    expect(newStatus).toEqual('analysis');
    expect(newTitle).toEqual('updating Title test');
  });
});
