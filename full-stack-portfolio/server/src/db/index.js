import mongoose from "mongoose";
import dns from "node:dns";
import { MONGODB_URI, DB_NAME } from "../constants.js";

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (dnsErr) {
  console.warn("Could not set custom DNS servers:", dnsErr);
}

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(MONGODB_URI, {
      dbName: DB_NAME,
    });
    console.log(
      `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`,
    );
  } catch (error) {
    console.log("MONGODB connection error ", error);
    process.exit(1);
  }
};

export default connectDB;
