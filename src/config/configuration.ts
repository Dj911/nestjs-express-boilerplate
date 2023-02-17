export default () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
      srv: process.env.DB_SRV
    },
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
  });