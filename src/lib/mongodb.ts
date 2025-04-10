import { MongoClient, MongoClientOptions } from 'mongodb';

declare global {
  var _mongoClientPromise: Promise<MongoClient>;
}

const uri = process.env.MONGODB_URI ?? '';
const options = {} as MongoClientOptions;

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!uri) {
  throw new Error(
    'Por favor, define la variable de entorno MONGODB_URI en .env.local',
  );
}

try {
  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
} catch (error) {
  console.error('Error al conectar con MongoDB:', error);
  throw new Error('No se pudo conectar a la base de datos');
}

export default clientPromise;
