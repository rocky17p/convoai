import dotenv from 'dotenv';
dotenv.config();
console.log('Loaded SambaNova API URL:', process.env.SAMBANOVA_API_URL);
console.log('SambaNova Key:', process.env.SAMBANOVA_API_KEY);
console.log('SambaNova URL:', process.env.SAMBANOVA_API_URL);

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js';
import agentRoutes from './routes/agent.js';
import analyticsRoutes from './routes/analytics.js';
// import workflowRoutes from './routes/workflow.js'; // Removed workflow routes

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://convoai-5zieqy4lt-pushkar-pawars-projects-337efcb7.vercel.app',
  credentials: true
}));
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.use('/auth', authRoutes);
app.use('/chat', authenticateToken, chatRoutes);
app.use('/agents', authenticateToken, agentRoutes);
app.use('/analytics', authenticateToken, analyticsRoutes);
// app.use('/api/workflows', authenticateToken, workflowRoutes); // Removed workflow routes

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('ConvoAI backend is running');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
