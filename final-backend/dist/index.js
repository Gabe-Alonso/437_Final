"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongodb_1 = require("mongodb");
const reviews_1 = require("./routes/reviews");
const auth_1 = require("./routes/auth");
// Read the .env file in the current working directory, and load values into process.env.
const PORT = process.env.PORT || 3000;
const staticDir = process.env.STATIC_DIR || "public";
const uploadDir = process.env.IMAGE_UPLOAD_DIR || "uploads";
async function setUpServer() {
    const { MONGO_USER, MONGO_PWD, MONGO_CLUSTER, DB_NAME } = process.env;
    const connectionStringRedacted = `mongodb+srv://${MONGO_USER}:<password>@${MONGO_CLUSTER}/${DB_NAME}`;
    const connectionString = `mongodb+srv://${MONGO_USER}:${MONGO_PWD}@${MONGO_CLUSTER}/${DB_NAME}`;
    console.log("Attempting Mongo connection at " + connectionStringRedacted);
    const mongoClient = await mongodb_1.MongoClient.connect(connectionString);
    const collectionInfos = await mongoClient.db().listCollections().toArray();
    console.log("MongoDB backend stuff next up");
    console.log(collectionInfos.map(collectionInfo => collectionInfo.name)); // For debug only
    console.log("MongoDB backend stuff done");
    const app = (0, express_1.default)();
    app.use(express_1.default.static(staticDir));
    app.use("/uploads", express_1.default.static(uploadDir));
    app.use(express_1.default.json());
    app.get("/hello", (req, res) => {
        res.send("Hello, World");
    });
    app.use("/api/*", auth_1.verifyAuthToken);
    (0, reviews_1.registerReviewRoutes)(app, mongoClient);
    (0, auth_1.registerAuthRoutes)(app, mongoClient);
    app.get("*", (req, res) => {
        console.log("none of the routes above me were matched");
        res.sendFile("index.html", { root: staticDir });
    });
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}
setUpServer().then();
