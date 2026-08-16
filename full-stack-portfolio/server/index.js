import dotenv from "dotenv";
import connectDB from "./src/db/index.js";
import app from "./src/app.js";
import { PORT } from "./src/constants.js";

dotenv.config();

connectDB()
  .then(() => {
    app.listen(PORT || 8000, () => {
      console.log(`⚙️ Server is running at port : ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });
