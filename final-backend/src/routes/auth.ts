import express, { Request, Response } from "express";
import { MongoClient } from "mongodb";
import {CredentialsProvider} from "../CredentialsProvider";

import jwt from "jsonwebtoken";
import { NextFunction } from 'express';



const signatureKey = process.env.JWT_SECRET
console.log("JWT_SECRET:", process.env.JWT_SECRET);

if (!signatureKey) {
    throw new Error("Missing JWT_SECRET from env file");
}

export function verifyAuthToken(
    req: Request,
    res: Response,
    next: NextFunction // Call next() to run the next middleware or request handler
) {
    const authHeader = req.get("Authorization");
    // The header should say "Bearer <token string>".  Discard the Bearer part.
    const token = authHeader && authHeader.split(" ")[1];
    console.log(token);
    if (!token) {
        res.status(401).end();
    } else { // signatureKey already declared as a module-level variable
        jwt.verify(token, signatureKey as string, (error, decoded) => {
            if (decoded) {
                res.locals.token = decoded;
                next();
            } else {
                res.status(403).end();
            }
        });
    }
}

function generateAuthToken(username: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        jwt.sign(
            { username: username },
            signatureKey as string,
            { expiresIn: "1d" },
            (error, token) => {
                if (error) reject(error);
                else resolve(token as string);
            }
        );
    });
}

export function registerAuthRoutes(app: express.Application, mongoClient: MongoClient){
    app.post("/auth/register", async (req: Request, res: Response) => {
        try {
            console.log("register request received");
            if (req.body.username == undefined || req.body.password == undefined) {
                res.status(400).send({
                    error: "Bad request",
                    message: "Missing username or password"
                });
            }

            const credentialsProvider = new CredentialsProvider(mongoClient);
            const result = await credentialsProvider.registerUser(req.body.username, req.body.password);
            if (!result) {
                res.status(400).send({
                    error: "Bad request",
                    message: "Username already exist"
                });
            }
            const token = await generateAuthToken(req.body.username);
            res.status(200).send({ token: token });

        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    });

    app.post("/auth/login", async (req: Request, res: Response) => {
        try {
            console.log("login request received");
            console.log(req.body.username, req.body.password);
            if (req.body.username == undefined || req.body.password == undefined) {
                res.status(400).send({
                    error: "Bad request",
                    message: "Missing username or password"
                });
            }

            const credentialsProvider = new CredentialsProvider(mongoClient);
            const result = await credentialsProvider.verifyPassword(req.body.username, req.body.password);
            if (!result) {
                res.status(401).send({
                    error: "Bad request",
                    message: "Bad username or password"
                });
            }else {
                const token = await generateAuthToken(req.body.username);
                res.status(200).send({ token: token });
            }


        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    });

}