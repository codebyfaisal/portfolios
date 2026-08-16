import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import allowOrigins from "./utils/allowOrigins.js";
import {
  globalLimiter,
  strictLimiter,
} from "./middlewares/rateLimiter.middleware.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: allowOrigins(),
    credentials: true,
  }),
);

app.use("/api", globalLimiter);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.get("/api/v1/test", (req, res) => {
  return res.json({
    message: "Welcome to the API: " + req.originalUrl,
    origins: allowOrigins(),
  });
});

// routes import
import authRouter from "./modules/auth/auth.routes.js";
import userRouter from "./modules/user/user.routes.js";
import serviceRouter from "./modules/services/service.routes.js";
import projectRouter from "./modules/projects/project.routes.js";
import testimonialRouter from "./modules/testimonials/testimonial.routes.js";
import messageRouter from "./modules/messages/message.routes.js";
import fileRouter from "./modules/files/file.routes.js";
import dashboardRouter from "./modules/dashboard/dashboard.routes.js";
import visitRouter from "./modules/visits/visit.routes.js";
import postRouter from "./modules/posts/post.routes.js";
import subscriberRouter from "./modules/subscribers/subscriber.routes.js";
import jobRouter from "./modules/job/job.routes.js";
import formRouter from "./modules/form/form.routes.js";

// routes declaration
app.use("/api/v1/auth", strictLimiter, authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/services", serviceRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/testimonials", testimonialRouter);
app.use("/api/v1/messages", strictLimiter, messageRouter);
app.use("/api/v1/files", fileRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/visits", visitRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/subscribers", strictLimiter, subscriberRouter);
app.use("/api/v1", jobRouter);
app.use("/api/v1/forms", strictLimiter, formRouter);

import { errorHandler } from "./middlewares/error.middleware.js";
app.use(errorHandler);

export default app;

