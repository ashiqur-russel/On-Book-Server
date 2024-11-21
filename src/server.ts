import mongoose from 'mongoose';
import app from './app';
import config from './app/config';

async function main() {
  try {
    await connectDatabase();

    app.listen(config.port, () => {
      console.log(`app is listening on port ${config.port}`);
    });
  } catch (err) {
    console.log(err);
  }
}

const connectDatabase = async () => {
  const MONGO_URI = config.database_url as string;

  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connection established successfully.');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

main();
