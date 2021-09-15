const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const app = require('../api/server');
const should = chai.should();
const expect = chai.expect;

const { MongoClient } = require('mongodb');
const mongoDbUrl = 'mongodb://mongodb:27017/Cookmaster';

describe('Teste para verificar se api esta funcionando', () => {
  it('Espera um status 200 ao chamar a root da url', (done) => {
    chai
      .request(app)
      .get('/')
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});

describe('POST /login - Teste para o endpoint de login', () => {
  let connection;
  let db;

  before(async () => {
    connection = await MongoClient.connect(mongoDbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = connection.db('Cookmaster');
    await db.collection('users').deleteMany({});
    const users = [{ name: 'admin', email: 'root@email.com', password: 'admin', role: 'admin' }];
    await db.collection('users').insertMany(users);
  });

  after(async () => {
    await connection.close();
  });

  it('Verificando se o token e retornado com sucesso', (done) => {
    chai
      .request(app)
      .post('/login')
      .send({
        email: 'root@email.com',
        password: 'admin',
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        res.body.should.have.property('token');
        done();
      });
  });
});

describe('POST /login - Teste para o endpoint de login', () => {
  it('Verifica se tem algum campo não informado corretamente', (done) => {
    chai
      .request(app)
      .post('/login')
      .send({
        email: 'erickjacquin@gmail.com',
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res).to.be.json;
        res.body.should.have.property('message').eql('All fields must be filled');
        done();
      });
  });
});

describe('POST /login - Teste para o endpoint de login', () => {
  it('Verifica se o ususário e senha são corretos - Nesse caso foi passado uma senha incorreta', (done) => {
    chai
      .request(app)
      .post('/login')
      .send({
        email: 'erickjacquin@gmail.com',
        password: '123456',
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res).to.be.json;
        res.body.should.have.property('message').eql('Incorrect username or password');
        done();
      });
  });
});

describe('POST /login - Teste para o endpoint de login', () => {
  it('Verifica se o ususário e senha são corretos - Nesse caso foi passado um usuário incorreto', (done) => {
    chai
      .request(app)
      .post('/login')
      .send({
        email: 'erickjacquin@gmail.om',
        password: '12345678',
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res).to.be.json;
        res.body.should.have.property('message').eql('Incorrect username or password');
        done();
      });
  });
});
