import app from './app';
import { connectToDatabase } from './database/index';
import * as dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT || 3001;

app.listen(port, async () => {
  console.log(`Server running on port ${port}`);
  try {
    await connectToDatabase();
    console.log('Database connection established.');
  } catch (error) {
    console.error('Failed to connect to the database:', error);
  }
});

