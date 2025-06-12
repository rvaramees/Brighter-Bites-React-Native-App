import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import authRoutes from './routes/authRoutes.js';  
import { connectDB } from './config/db.js';

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;


app.use("/api/auth", authRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB();
});
