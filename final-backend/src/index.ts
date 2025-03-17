import express, { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import path from "path";
import { MongoClient } from "mongodb";
import {registerReviewRoutes} from "./routes/reviews";
import {registerAuthRoutes, verifyAuthToken} from "./routes/auth";


// Read the .env file in the current working directory, and load values into process.env.
const PORT = process.env.PORT || 3000;

const staticDir = process.env.STATIC_DIR || "public";

const uploadDir = process.env.IMAGE_UPLOAD_DIR || "uploads";

async function setUpServer() {
    const { MONGO_USER, MONGO_PWD, MONGO_CLUSTER, DB_NAME } = process.env;

    const connectionStringRedacted = `mongodb+srv://${MONGO_USER}:<password>@${MONGO_CLUSTER}/${DB_NAME}`;
    const connectionString = `mongodb+srv://${MONGO_USER}:${MONGO_PWD}@${MONGO_CLUSTER}/${DB_NAME}`;

    console.log("Attempting Mongo connection at " + connectionStringRedacted);

    const mongoClient = await MongoClient.connect(connectionString);
    const collectionInfos = await mongoClient.db().listCollections().toArray();
    console.log("MongoDB backend stuff next up");
    console.log(collectionInfos.map(collectionInfo => collectionInfo.name)); // For debug only
    console.log("MongoDB backend stuff done");
    const app = express();

    app.use(express.static(staticDir));
    app.use("/uploads", express.static(uploadDir))
    app.use(express.json());

    app.get("/hello", (req: Request, res: Response) => {
        res.send("Hello, World");
    });

    app.use("/api/*", verifyAuthToken);

    registerReviewRoutes(app, mongoClient);
    registerAuthRoutes(app, mongoClient);

    app.get("*", (req: Request, res: Response) => {
        console.log("none of the routes above me were matched");
        res.sendFile("index.html", {root: staticDir});
    });

    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}

setUpServer().then();
