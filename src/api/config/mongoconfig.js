const { MongoClient } = require('mongodb');

const url = process.env.MONGO_DB_URL;
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

// Database Name
const dbName = process.env.DB_NAME;
const collection = async (col) => {
  // eslint-disable-next-line no-underscore-dangle
  if (client._eventsCount === 0) {
    await client.connect();
  }
  const db = client.db(dbName);
  const collect = db.collection(col);
  return collect;
};

module.exports = collection;
