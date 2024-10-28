import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://localhost:27017/");

export async function connectDb() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        // Use the same database name as in MongoDB Compass
        return client.db("bookTracker");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}
