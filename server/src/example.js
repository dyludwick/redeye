import Server from './server';
import {} from 'dotenv/config';

const server = new Server({
  id: process.env.CONFIG_ID,
  database: process.env.DB,
  port: process.env.PORT
});
server.init();
server.listen();
