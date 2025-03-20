import {MongoClient, ObjectId} from "mongodb";
import { Document } from "bson"; // Import MongoDB's Document type


export interface Review {

    _id: string,
    album: string,
    artist: string,
    rating: string,
    review: string,
    author: string
}

export interface Author {
    _id: string;
    username: string;
    password: string;
}

export class ReviewProvider {
    constructor(private readonly mongoClient: MongoClient) {}

    async getReviews(author?: string): Promise<Document[]> {
        const collectionName = process.env.REVIEWS_COLLECTION_NAME;
        const authorsCollectionName = process.env.CREDS_COLLECTION_NAME;

        if (!collectionName || !authorsCollectionName) {
            throw new Error("Missing collection names from environment variables");
        }

        console.log('Using collections:', { collectionName, authorsCollectionName });

        const reviewCollection = this.mongoClient.db().collection<Review>(collectionName);

        // const pipeline: any[] = [
        //     {
        //         $lookup: {
        //             from: authorsCollectionName,
        //             localField: 'author',  // This is a string in images
        //             foreignField: '_id',   // This is also a string in users
        //             as: 'author'
        //         }
        //     },
        //     {
        //         $unwind: {
        //             path: "$author",
        //             preserveNullAndEmptyArrays: true // Keep images even if no author found
        //         }
        //     }
        // ];
        //
        // if (author) {
        //     pipeline.unshift({
        //         $match: { author }
        //     });
        // }

        const reviews = await reviewCollection.aggregate().toArray();

        console.log('Fetched reviews:', reviews);

        //return reviews as (Review & { author: Author })[];
        return reviews;
    }

    async createReview(imageId: string, album: string, artist: string, rating: string, review: string, author: string) {
        const collectionName = process.env.REVIEWS_COLLECTION_NAME;

        if (!collectionName) {
            throw new Error("Missing collection name from environment variables");
        }

        console.log("Using collection:", collectionName);
        console.log("Potential problem 1");
        const reviewCollection = this.mongoClient.db().collection<Review>(collectionName);
        console.log("Potential problem 2");
        // Construct the new image document with ObjectId for _id
        const newReview: Review = {
            _id: imageId,
            album: album,
            artist: artist,
            rating: rating,
            review: review,
            author: author
        };
        console.log("Potential problem 3");
        // Insert the new image into the database
        const result = await reviewCollection.insertOne(newReview); // Cast to Document
        console.log("Potential problem 4");
        console.log("Insert result:", result);
        console.log("Potential problem 5");
        return result.insertedId;
    }


    async updateImageName(imageId: string, newName: string): Promise<number> {
        const collectionName = process.env.IMAGES_COLLECTION_NAME;

        if (!collectionName) {
            throw new Error("Missing collection name from environment variables");
        }

        console.log('Using collection:', collectionName);

        const imagesCollection = this.mongoClient.db().collection<Review>(collectionName);

        const result = await imagesCollection.updateOne(
            { _id: imageId },
            { $set: { name: newName } }
        );

        console.log('Update result:', result);

        return result.matchedCount;
    }

    async deleteReview(reviewId: string): Promise<number> {
        console.log("About to delete: ", reviewId);
        const collectionName = process.env.REVIEWS_COLLECTION_NAME;
        if (!collectionName) {
            throw new Error("Missing collection name from environment variables");
        }
        const reviewCollection = this.mongoClient.db().collection<Review>(collectionName);
        const result = await reviewCollection.deleteOne({ _id: reviewId });
        return result.deletedCount || 0;
    }


}

