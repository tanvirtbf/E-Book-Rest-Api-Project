import app from "./src/app";
import { config } from "./src/config/config";
import connectDB from "./src/config/db";

const startServer = async () => {
  // Connect database
  await connectDB();

  const port = config.port || 8080;

  app.listen(port, () => {
    console.log(`Server Run With: http://localhost:${port}`);
  });
};

startServer();
