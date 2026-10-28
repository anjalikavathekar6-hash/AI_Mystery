import mongoose from 'mongoose';
import { app } from './app.js';
import { env } from './config/env.js';

async function start() {
  try {
    await mongoose.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
    app.listen(env.PORT, () => console.log(`AI Mystery Room API listening on http://localhost:${env.PORT}`));
  } catch (error) {
    console.error('Could not connect to MongoDB:', error instanceof Error ? error.message : 'unknown error');
    process.exit(1);
  }
}
void start();
