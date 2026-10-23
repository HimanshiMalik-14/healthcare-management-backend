require('dotenv').config();
const http = require('http');
const app = require('./app');
const { sequelize } = require('./models');

// Validate required env vars at startup
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];
const missingVars = requiredEnvVars.filter((v) => !process.env[v]);

if (missingVars.length > 0) {
  console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
  process.exit(1);
}

const DEFAULT_PORT = parseInt(process.env.PORT || '5000', 10);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection authenticated successfully.');

    await sequelize.sync();
    console.log('Database synchronized.');

    const listenOnPort = (port) => {
      const server = http.createServer(app);

      server.listen(port, () => {
        console.log(`Server running on port ${port}`);
      });

      server.on('error', (err) => {
        if (err.code === 'EADDRINUSE' && port === 5000) {
          console.warn(`Port 5000 is in use, falling back to port 5001...`);
          listenOnPort(5001);
        } else {
          console.error('Server error:', err);
          process.exit(1);
        }
      });
    };

    listenOnPort(DEFAULT_PORT);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
