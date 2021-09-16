const { MongoClient } = require('mongodb');

const { MongoMemoryServer } = require('mongodb-memory-server');

const mongoServer = new MongoMemoryServer();
let connection;
let db;
let mongo;
exports.dbConnect = async () => {
  mongo = await MongoMemoryServer.create({
    instance: { ip: 'localhost', dbName: 'Cookmaster', port: 27017 },
  });
  const mongoUrl = await mongo.getUri();
  process.env.MONGO_DB_URL = mongoUrl;

  // process.env.DB_NAME = await mongo.getDbName();

  connection = await MongoClient.connect(mongoUrl.concat('/Cookmaster'), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  db = connection.db('Cookmaster');
  await db.collection('users').deleteMany({});
  const users = [
    { name: 'admin', email: 'root@email.com', password: 'admin', role: 'admin' },
    { name: 'user', email: 'user@email.com', password: 'user', role: 'user' },
  ];
  await db.collection('users').insertMany(users);
};

exports.dbDisconnect = async () => {
  await mongo.close();
  await mongoServer.stop();
};
