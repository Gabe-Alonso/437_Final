import express, { Request, Response } from "express";
import { MongoClient } from "mongodb";
import {Image, ImageProvider} from "../ImageProvider";

export function registerImageRoutes(app: express.Application, mongoClient: MongoClient) {
    app.get("/api/images", async (req: Request, res: Response) => { // Marking the callback as async
        try {
            let userId: string | undefined = undefined;
            if (typeof req.query.createdBy === "string") {
                userId = req.query.createdBy;
            }
            console.log(userId);
            const imageProvider = new ImageProvider(mongoClient);
            const images: Image[] = await imageProvider.getAllImages(userId);
            res.json(images);
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    });


    app.patch("/api/images/:id", async (req: Request, res: Response) => {
        try {
            if(req.body.name === undefined || req.body.name === "") {
                res.status(400).send({
                    error: "Bad request",
                    message: "Missing name property"
                });
            }else{
                console.log("Request received for image ID:", req.params.id);
                console.log("Request received for new name:", req.body.name);
                // Your logic to handle the patch request goes here
                const imageProvider = new ImageProvider(mongoClient);
                const imagesMatched = await imageProvider.updateImageName(req.params.id, req.body.name);
                if (imagesMatched == 0){
                    res.status(404).send({
                        error: "Not found",
                        message: "Image does not exist"
                    });
                }else{
                    res.status(204).send("No content");
                }
            }

        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    });

}