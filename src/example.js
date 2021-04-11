import Server from './server';

const server = new Server({
  id: process.env.CONFIG_ID,
  database: {
    id: process.env.DB,
    host: process.env.DB_HOST,
    name: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    pool: process.env.DB_POOL ? true : false,
    port: process.env.DB_PORT,
    user: process.env.DB_USER
  },
  port: process.env.PORT,
  proxy: {
    hosts: {
      PROXY_HOSTNAME_DEV: process.env.PROXY_HOSTNAME_DEV,
      PROXY_HOSTNAME_PROD: process.env.PROXY_HOSTNAME_PROD
    },
    keys: {
      PROXY_API_KEY_DEV: process.env.PROXY_API_KEY_DEV,
      PROXY_API_KEY_PROD: process.env.PROXY_API_KEY_PROD
    }
  }
});

(async () => {
  try {
    const instance = await server.init();
    server.listen(instance);
  } catch (error) {
    console.log(error);
  }
})();
