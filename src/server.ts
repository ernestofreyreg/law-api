import app from "./app";
import sequelize from "./config/database";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;

// Database sync
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: process.env.NODE_ENV === "development" });
    console.log("Database connected and synced successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
};

// Start server
const startServer = async () => {
  await syncDatabase();

  app.listen(PORT, () => {
    console.log(
      `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
    );
  });
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
  console.error(`Error: ${err.message}`);
  // Close server & exit process
  process.exit(1);
});

startServer();
