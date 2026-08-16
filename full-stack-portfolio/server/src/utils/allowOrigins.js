import {
  CORS_ALLOWED_ORIGINS,
  CLIENT_ALLOWED_ORIGINS,
  ADMIN_ALLOWED_ORIGINS,
  NODE_ENV,
} from "../constants.js";

const parseOrigins = (originsStr) =>
  (originsStr || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

const allowOrigins = () => {
  const corsOrigins = parseOrigins(CORS_ALLOWED_ORIGINS);
  const clientOrigins = parseOrigins(CLIENT_ALLOWED_ORIGINS);
  const adminOrigins = parseOrigins(ADMIN_ALLOWED_ORIGINS);

  let origins = [];
  if (NODE_ENV === "development") {
    origins =
      corsOrigins.length > 0
        ? corsOrigins
        : ["http://localhost:5173", "http://localhost:5174"];
  } else {
    origins = [...corsOrigins, ...clientOrigins, ...adminOrigins];
  }

  return Array.from(new Set(origins));
};

export default allowOrigins;

