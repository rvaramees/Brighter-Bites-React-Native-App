import express from 'express'; // Import express for creating the server
import cors from 'cors'; // Import CORS for handling cross-origin requests
import 'dotenv/config'; // Import environment variables
import authRoutes from './routes/authRoutes.js';  // Import authentication routes
import parentRoutes from './routes/parentRoutes.js'; // Import parent routes 
import childrenRoutes from './routes/childrenRoutes.js'; // Import child routes
import homeRoutes from './routes/homeRoutes.js'; // Import home routes

import { connectDB } from './config/db.js'; // Import database connection function

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.use("/api/auth", authRoutes);
app.use("/api/parent", parentRoutes);
app.use("/api/children", childrenRoutes);
app.use("/api/home", homeRoutes);




app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB();
});
