import express from "express";
import morgan from "morgan";

import libraryRoutes from "../app/routes/library-routes"
import usersRoutes from "../app/routes/user-routes"
import authRoutes from "../app/routes/auth-routes"
import helmet from "helmet";
import config from "./config";
import cors from 'cors';

import { createDefaultRoles, createDefaultAdmin} from '../libs/init';

const app  = express();
createDefaultRoles();
createDefaultAdmin();

const corsOptions = {
    origin: config.CORS_ORIGIN,
};
  
app.use(cors(corsOptions));
app.use(morgan("common"));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
    return res.status(200).json("welcome to BE of the library");
});

app.use('/api/v1/books', libraryRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/auth", authRoutes);

export default app;