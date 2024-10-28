import express from 'express';
import { MongoClient, Db } from 'mongodb';
import path from 'path';
import { Book, IBook } from './models/Book';

const app = express();
const port = 3000;

// Middleware
app.use(express.json());

// Serve static files with correct MIME types
app.use('/js', express.static(path.join(__dirname, '../public/js'), {
    setHeaders: (res, path) => {
        if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        }
    }
}));

app.use(express.static('public'));

// MongoDB connection
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'bookTracker';
const collectionName = 'books';

let client: MongoClient;
let db: Db;

async function connectToDb() {
    try {
        client = await MongoClient.connect(mongoUrl);
        db = client.db(dbName);
        console.log('Connected to MongoDB');
        
        // Log the number of books in the collection
        const count = await db.collection(collectionName).countDocuments();
        console.log(`Found ${count} books in the database`);
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1);
    }
}

// Routes
app.get('/api/books', async (req, res) => {
    try {
        const books = await db.collection(collectionName).find({}).toArray();
        console.log('Fetched books:', books.length); // Debug log
        res.json(books);
    } catch (err) {
        console.error('Error fetching books:', err);
        res.status(500).json({ error: 'Failed to fetch books' });
    }
});

app.post('/api/books', async (req, res) => {
    try {
        const bookData = req.body;
        const book = new Book(
            bookData.title,
            bookData.author,
            bookData.pages,
            bookData.status,
            bookData.price,
            0,
            bookData.format,
            bookData.suggestedBy
        );
        
        const result = await db.collection(collectionName).insertOne(book.toJSON());
        res.json(result);
    } catch (err) {
        console.error('Error adding book:', err);
        res.status(500).json({ error: 'Failed to add book' });
    }
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start server
connectToDb().then(() => {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
});
