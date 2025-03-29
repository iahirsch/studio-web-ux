// apps/backend/src/combined-server.js
import { createServer } from 'http';
import { exec } from 'child_process';
import express from 'express';
import { OjpService } from './ojp-service/ojp-service.js';

// Start the NestJS app in a separate process
const nestProcess = exec(
  'node dist/apps/backend/main.js',
  (error, stdout, stderr) => {
    if (error) {
      console.error(`NestJS error: ${error}`);
      return;
    }
    console.log(`NestJS stdout: ${stdout}`);
    console.error(`NestJS stderr: ${stderr}`);
  }
);

// Create Express app for the OJP service
const app = express();
app.use(express.json());

// Initialize OJP service
const ojpService = new OjpService(
  process.env.OJP_API_URL || 'https://api.opentransportdata.swiss/ojp2020',
  process.env.OJP_API_TOKEN
);

// Add OJP service endpoints
app.post('/ojp-service/location-search', async (req, res) => {
  try {
    const result = await ojpService.locationSearch(req.body.query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/ojp-service/trip-search', async (req, res) => {
  try {
    const { from, to, date, time, mode } = req.body;
    const result = await ojpService.tripSearch(from, to, date, time, mode);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the Express server
const port = process.env.PORT || 3000;
const server = createServer(app);
server.listen(port, () => {
  console.log(`Combined server running on port ${port}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    nestProcess.kill();
  });
});
