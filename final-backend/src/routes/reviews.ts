import express, { Request, Response } from "express";
import { MongoClient } from "mongodb";
import {Review, ReviewProvider} from "../ReviewProvider";
import {handleImageFileErrors, imageMiddlewareFactory} from "../ImageUploadMiddleware";
import { Document } from "bson"; // Import MongoDB's Document type


export function registerReviewRoutes(app: express.Application, mongoClient: MongoClient) {
    app.get("/api/reviews", async (req: Request, res: Response) => { // Marking the callback as async
        try {
            let username: string | undefined = undefined;
            if (typeof req.query.createdBy === "string") {
                username = req.query.createdBy;
            }
            console.log(username);
            const reviewProvider = new ReviewProvider(mongoClient);
            const reviews: Document[] = await reviewProvider.getReviews(username);
            res.json(reviews);
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    });


    // app.patch("/api/reviews/:id", async (req: Request, res: Response) => {
    //     try {
    //         if(req.body.name === undefined || req.body.name === "") {
    //             res.status(400).send({
    //                 error: "Bad request",
    //                 message: "Missing name property"
    //             });
    //         }else{
    //             console.log("Request received for image ID:", req.params.id);
    //             console.log("Request received for new name:", req.body.name);
    //             // Your logic to handle the patch request goes here
    //             const imageProvider = new ReviewProvider(mongoClient);
    //             const imagesMatched = await imageProvider.updateImageName(req.params.id, req.body.name);
    //             if (imagesMatched == 0){
    //                 res.status(404).send({
    //                     error: "Not found",
    //                     message: "Image does not exist"
    //                 });
    //             }else{
    //                 res.status(204).send("No content");
    //             }
    //         }
    //
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).send("Internal Server Error");
    //     }
    // });

    app.post(
        "/api/reviews",
        imageMiddlewareFactory.single("image"), // Multer middleware
        handleImageFileErrors, // Error handling middleware
        async (req: Request, res: Response): Promise<void> => {
            console.log("In post request", req.file, req.body);

             if (!req.body) {
                res.status(400).json({
                    error: "Bad Request",
                    message: "Missing required fields: image and title."
                });
                return; // Explicitly return `void`
            }

            const _id = req.body._id;
            const album = req.body.album;
            const artist = req.body.artist;
            const rating = req.body.rating;
            const review = req.body.review;
            const author = res.locals.token.username;

            console.log(_id, album, artist, rating, review, author);

            const reviewProvider = new ReviewProvider(mongoClient);
            console.log("creating review");
            const imageAdded= await reviewProvider.createReview(_id, album, artist, rating, review, author);


            res.status(201).send();

            return; // Ensure function returns `void`
        }
    );

    app.delete('/api/reviews/:id', async (req, res) => {
        const reviewId = req.params.id;
        console.log("In reviews.ts: ", reviewId);
        try {
            const reviewProvider = new ReviewProvider(mongoClient);
            const deletedCount = await reviewProvider.deleteReview(reviewId);
            if (deletedCount === 1) {
                res.status(200).json({ message: 'Review deleted successfully' });
            } else {
                res.status(404).json({ error: 'Review not found' });
            }
        } catch (error) {
            console.error("Error deleting review:", error);
            res.status(500).json({ error: 'Failed to delete review' });
        }
    });






}