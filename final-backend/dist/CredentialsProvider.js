"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CredentialsProvider = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
class CredentialsProvider {
    collection;
    constructor(mongoClient) {
        const COLLECTION_NAME = process.env.CREDS_COLLECTION_NAME;
        if (!COLLECTION_NAME) {
            throw new Error("Missing CREDS_COLLECTION_NAME from env file");
        }
        this.collection = mongoClient.db().collection(COLLECTION_NAME);
    }
    async registerUser(username, plaintextPassword) {
        if ((await this.collection.find({ username: username }).count()) > 0) {
            console.log("User already exists!");
            return false;
        }
        else {
            const salt = await bcrypt_1.default.genSalt(10);
            const hashedPassword = await bcrypt_1.default.hash(plaintextPassword, salt);
            console.log(salt);
            console.log(hashedPassword);
            await this.collection.insertOne({
                username: username,
                password: hashedPassword,
            });
            return true;
        }
    }
    async verifyPassword(username, plaintextPassword) {
        const specifiedUser = await this.collection.findOne({ username: username });
        if (specifiedUser) {
            console.log(specifiedUser);
            console.log(plaintextPassword);
            console.log(specifiedUser.password);
            const hashedPassword = specifiedUser.password;
            const match = await bcrypt_1.default.compare(plaintextPassword, hashedPassword);
            if (match) {
                return true;
            }
        }
        else {
            console.error('User not found.');
            return false;
        }
    }
}
exports.CredentialsProvider = CredentialsProvider;
