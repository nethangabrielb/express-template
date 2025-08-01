import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import guestRouter from "./routes/guestRouter.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", guestRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
