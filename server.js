import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDb from './server/config/db.js';
import contactRoutes from './server/routes/contactRoutes.js';
import projectRoutes from './server/routes/projectRoutes.js';
import qualificationRoutes from './server/routes/qualificationRoutes.js';
import userRoutes from './server/routes/userRoutes.js';

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    message: 'Portfolio API is running.',
    endpoints: {
      contacts: '/api/contacts',
      projects: '/api/projects',
      qualifications: '/api/qualifications',
      education: '/api/educations',
      users: '/api/users',
    },
  });
});

app.get('/api/health', (req, res) => {
  res.json({ message: 'API health check passed.', status: 'ok' });
});

app.use('/api/contacts', contactRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/qualifications', qualificationRoutes);
app.use('/api/educations', qualificationRoutes);
app.use('/api/users', userRoutes);

app.use((err, req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Something went wrong.', error: err.message });
});

await connectDb();

app.listen(PORT, () => {
  console.log(`Portfolio API listening on http://localhost:${PORT}`);
});
