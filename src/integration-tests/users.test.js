const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const app = require('../api/server');

const should = chai.should();
const expect = chai.expect;

const { dbConnect, dbDisconnect } = require('../utils/test/dbHandler.utils');

let defaultUser = {
  email: 'root@email.com',
  password: 'admin',
};

let token;

describe('POST /users - Testes para o endpoint /users', () => {
  let connection;
  let db;
  beforeEach((done) => {
    chai
      .request(app)
      .post('/login')
      .send(defaultUser)
      .end((err, res) => {
        token = res.body.token;
        res.should.have.status(200);
        done();
      });
  });

  before(async () => {
    dbConnect();
  });

  after(async () => {
    dbDisconnect();
  });
  it('Buscando todos dos usuarios', (done) => {
    chai
      .request(app)
      .get('/users')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        done();
      });
  });

  it('Inserindo um usuario com role user com sucesso', (done) => {
    chai
      .request(app)
      .post('/users')
      .send({
        name: 'teste',
        email: 'dmaaaao@aganaaa.com',
        password: 'admin',
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        done();
      });
  });

  it('Inserindo um usuario com role admin com sucesso', (done) => {
    chai
      .request(app)
      .post('/users/admin')
      .set({ Authorization: `${token}` })
      .send({
        name: 'admin1',
        email: 'admin@aganaaa.com',
        password: 'admin',
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        done();
      });
  });

  it('Tentar inserir um usuario com role admin sem token', (done) => {
    chai
      .request(app)
      .post('/users/admin')
      .send({
        name: 'admin1',
        email: 'admin@aganaaa.com',
        password: 'admin',
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res).to.be.json;
        done();
      });
  });

  it('Tentar inserir um usuario com role admin com token invalido', (done) => {
    chai
      .request(app)
      .post('/users/admin')
      .set({ Authorization: '990' })
      .send({
        name: 'admin1',
        email: 'admin@aganaaa.com',
        password: 'admin',
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res).to.be.json;
        done();
      });
  });
});
