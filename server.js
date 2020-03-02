const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

// Body parser config to accept our datatypes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Initialize DB
const db = require('./models');


// Serve public assets
app.use(express.static(__dirname + '/public'));

// ROUTES

// // testing view routes
app.get('/', (req, res) => {
    res.sendFile('views/index.html', {
        root: __dirname 
    });
});





// Start Server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}/`));
