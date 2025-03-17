"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewProvider = void 0;
class ReviewProvider {
    mongoClient;
    constructor(mongoClient) {
        this.mongoClient = mongoClient;
    }
    async getReviews(author) {
        const collectionName = process.env.REVIEWS_COLLECTION_NAME;
        const authorsCollectionName = process.env.CREDS_COLLECTION_NAME;
        if (!collectionName || !authorsCollectionName) {
            throw new Error("Missing collection names from environment variables");
        }
        console.log('Using collections:', { collectionName, authorsCollectionName });
        const reviewCollection = this.mongoClient.db().collection(collectionName);
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
    async createReview(imageId, album, artist, rating, review, author) {
        const collectionName = process.env.REVIEWS_COLLECTION_NAME;
        if (!collectionName) {
            throw new Error("Missing collection name from environment variables");
        }
        console.log("Using collection:", collectionName);
        console.log("Potential problem 1");
        const reviewCollection = this.mongoClient.db().collection(collectionName);
        console.log("Potential problem 2");
        // Construct the new image document with ObjectId for _id
        const newReview = {
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
    async updateImageName(imageId, newName) {
        const collectionName = process.env.IMAGES_COLLECTION_NAME;
        if (!collectionName) {
            throw new Error("Missing collection name from environment variables");
        }
        console.log('Using collection:', collectionName);
        const imagesCollection = this.mongoClient.db().collection(collectionName);
        const result = await imagesCollection.updateOne({ _id: imageId }, { $set: { name: newName } });
        console.log('Update result:', result);
        return result.matchedCount;
    }
}
exports.ReviewProvider = ReviewProvider;
