const express = require('express');
const app = express();
const PORT = 3000;

// middleware de traitement des requêtes en JSON
app.use(express.json());

// tableau pour stocker les items
let items = [];

//  GET simple pour tester
app.get('/', (req, res) => {
    res.send('Hello, Express.js!');
});

// POST
app.post('/items', (req, res) => {
    const newItem = {
        id: items.length + 1,
        ...req.body
    };
    items.push(newItem);
    res.status(201).json(newItem);
});

// GET
app.get('/items', (req, res) => {
    res.json(items);
});

// GET by ID
app.get('/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const item = items.find(item => item.id === id);
    if (item) {
        res.json(item);
    } else {
        res.status(404).json({ message: "Item non trouvé" });
    }
});

// PUT
app.put('/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
        items[index] = { ...items[index], ...req.body, id };
        res.json(items[index]);
    } else {
        res.status(404).json({ message: "Item non trouvé" });
    }
});

// DELETE
app.delete('/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
        const deletedItem = items.splice(index, 1);
        res.json(deletedItem[0]);
    } else {
        res.status(404).json({ message: "Item non trouvé" });
    }
});

// lancement du serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
