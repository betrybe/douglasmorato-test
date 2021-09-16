const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const app = require('../api/server');
const { MongoClient } = require('mongodb');
const should = chai.should();
const expect = chai.expect;

const { dbConnect, dbDisconnect } = require('../utils/test/dbHandler.utils');

let defaultAdmin = {
  email: 'root@email.com',
  password: 'admin',
};
let defaultUser = {
  email: 'user@email.com',
  password: 'user',
};

let token;
let tokenuser;
let id;

describe('Testes para o endpoint /recipes', () => {
  beforeEach((done) => {
    chai
      .request(app)
      .post('/login')
      .send(defaultAdmin)
      .end((err, res) => {
        token = res.body.token;
        res.should.have.status(200);
        done();
      });
  });

  beforeEach((done) => {
    chai
      .request(app)
      .post('/login')
      .send(defaultUser)
      .end((err, res) => {
        tokenuser = res.body.token;
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

  it('Buscando todos as receitas', (done) => {
    chai
      .request(app)
      .get('/recipes')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        done();
      });
  });

  it('Tentando inserir  uma receita sem dados obrigatorios', (done) => {
    chai
      .request(app)
      .post('/recipes')
      .set({ Authorization: `${token}` })
      .send({
        ingredients: 'varios ingredientes',
        preparation: 'bater tudo junto no liquidificador',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res).to.be.json;
        done();
      });
  });

  it('Inserindo uma receita com sucesso', (done) => {
    chai
      .request(app)
      .post('/recipes')
      .set({ Authorization: `${token}` })
      .send({
        name: 'nova receita',
        ingredients: 'varios ingredientes',
        preparation: 'bater tudo junto no liquidificador',
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        id = res.body.recipe._id;
        done();
      });
  });

  it('Buscando uma receita por id', (done) => {
    chai
      .request(app)
      .get(`/recipes/${id}`)
      .set({ Authorization: `${token}` })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        done();
      });
  });

  it('Alterando uma receita com sucesso', (done) => {
    chai
      .request(app)
      .put(`/recipes/${id}`)
      .set({ Authorization: `${token}` })
      .send({
        name: 'Alterada',
        ingredients: 'varios ingredientes',
        preparation: 'bater tudo junto no liquidificador',
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        done();
      });
  });
  it('Upload da imagem da receita inserida com sucesso', (done) => {
    chai
      .request(app)
      .put(`/recipes/${id}/image`)
      .set({ Authorization: `${token}` })
      .attach('image', './src/uploads/ratinho.jpg')
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it('Tentando alterar uma receita com um usuario que não incluir e não é admin', (done) => {
    chai
      .request(app)
      .put(`/recipes/${id}`)
      .set({ Authorization: `${tokenuser}` })
      .send({
        name: 'Alterada errada',
        ingredients: 'varios ingredientes',
        preparation: 'bater tudo junto no liquidificador',
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res).to.be.json;
        done();
      });
  });

  it('Excluindo uma receita com sucesso', (done) => {
    chai
      .request(app)
      .delete(`/recipes/${id}`)
      .set({ Authorization: `${token}` })
      .end((err, res) => {
        expect(res).to.have.status(204);
        done();
      });
  });
});
