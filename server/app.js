import express from "express";
import cors from "cors";
import usersRouter from "./apps/usersRouter.js";
import packageRouter from "./apps/packageRouter.js";
import merryMatchingRouter from "./apps/merrymatchRouter.js";
import complaintRouter from "./apps/complaintRouter.js";
import billingRouter from "./apps/billingRouter.js";

async function init() {
  // Express app and port
  const api = express();
  const port = 3000;

  // Middleware
  api.use(express.json());
  api.use(cors());

  api.use("/users", usersRouter);
  api.use("/billing", billingRouter);
  api.use("/package", packageRouter);
  api.use("/complaint", complaintRouter);
  api.use("/merrymatching", merryMatchingRouter);

  // Start the server
  api.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

init().catch((error) => console.error("Error initializing app:", error));
