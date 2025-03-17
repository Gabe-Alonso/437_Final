"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAuthToken = verifyAuthToken;
exports.registerAuthRoutes = registerAuthRoutes;
const CredentialsProvider_1 = require("../CredentialsProvider");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signatureKey = process.env.JWT_SECRET;
console.log("JWT_SECRET:", process.env.JWT_SECRET);
if (!signatureKey) {
    throw new Error("Missing JWT_SECRET from env file");
}
function verifyAuthToken(req, res, next // Call next() to run the next middleware or request handler
) {
    const authHeader = req.get("Authorization");
    // The header should say "Bearer <token string>".  Discard the Bearer part.
    const token = authHeader && authHeader.split(" ")[1];
    console.log(token);
    if (!token) {
        res.status(401).end();
    }
    else { // signatureKey already declared as a module-level variable
        jsonwebtoken_1.default.verify(token, signatureKey, (error, decoded) => {
            if (decoded) {
                res.locals.token = decoded;
                next();
            }
            else {
                res.status(403).end();
            }
        });
    }
}
function generateAuthToken(username) {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.sign({ username: username }, signatureKey, { expiresIn: "1d" }, (error, token) => {
            if (error)
                reject(error);
            else
                resolve(token);
        });
    });
}
function registerAuthRoutes(app, mongoClient) {
    app.post("/auth/register", async (req, res) => {
        try {
            console.log("register request received");
            if (req.body.username == undefined || req.body.password == undefined) {
                res.status(400).send({
                    error: "Bad request",
                    message: "Missing username or password"
                });
            }
            const credentialsProvider = new CredentialsProvider_1.CredentialsProvider(mongoClient);
            const result = await credentialsProvider.registerUser(req.body.username, req.body.password);
            if (!result) {
                res.status(400).send({
                    error: "Bad request",
                    message: "Username already exist"
                });
            }
            const token = await generateAuthToken(req.body.username);
            res.status(200).send({ token: token });
        }
        catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    });
    app.post("/auth/login", async (req, res) => {
        try {
            console.log("login request received");
            console.log(req.body.username, req.body.password);
            if (req.body.username == undefined || req.body.password == undefined) {
                res.status(400).send({
                    error: "Bad request",
                    message: "Missing username or password"
                });
            }
            const credentialsProvider = new CredentialsProvider_1.CredentialsProvider(mongoClient);
            const result = await credentialsProvider.verifyPassword(req.body.username, req.body.password);
            if (!result) {
                res.status(401).send({
                    error: "Bad request",
                    message: "Bad username or password"
                });
            }
            else {
                const token = await generateAuthToken(req.body.username);
                res.status(200).send({ token: token });
            }
        }
        catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    });
}
