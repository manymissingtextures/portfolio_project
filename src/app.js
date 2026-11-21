const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { isDbConnected, mongoose } = require('./config/db');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Portfolio backend is running successfully.',
    version: '1.0.0',
    database: {
      connected: isDbConnected(),
      name: mongoose.connection.name || null,
    },
  });
});

app.use('/api/contacts', require('./routes/contactRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/qualifications', require('./routes/qualificationRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/auth', require('./routes/authRoutes'));

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || 'Server error',
  });
});

module.exports = app;
