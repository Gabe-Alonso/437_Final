import { Collection, MongoClient } from "mongodb";
import bcrypt from "bcrypt";

interface ICredentialsDocument {
    username: string;
    password: string;
}

export class CredentialsProvider {
    private readonly collection: Collection<ICredentialsDocument>;

    constructor(mongoClient: MongoClient) {
        const COLLECTION_NAME = process.env.CREDS_COLLECTION_NAME;
        if (!COLLECTION_NAME) {
            throw new Error("Missing CREDS_COLLECTION_NAME from env file");
        }
        this.collection = mongoClient.db().collection<ICredentialsDocument>(COLLECTION_NAME);
    }

    async registerUser(username: string, plaintextPassword: string) {
        if ((await this.collection.find({username: username}).count()) > 0) {
            console.log("User already exists!");
            return false;
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(plaintextPassword, salt);
            console.log(salt);
            console.log(hashedPassword);
            await this.collection.insertOne({
                username: username,
                password: hashedPassword,
            })

            return true;
        }

    }

    async verifyPassword(username: string, plaintextPassword: string) {
        const specifiedUser = await this.collection.findOne({ username: username });
        if (specifiedUser) {
            console.log(specifiedUser);
            console.log(plaintextPassword);
            console.log(specifiedUser.password);
            const hashedPassword = specifiedUser.password;
            const match = await bcrypt.compare(plaintextPassword, hashedPassword);
            if (match) {
                return true;
            }
        } else {
            console.error('User not found.');
            return false;
        }
    }
}
