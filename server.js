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


// -------------------- API ROUTES

// // testing view routes
app.get('/', (req, res) => {
    res.sendFile('views/index.html', {
        root: __dirname 
    });
});

// -------------------- API RECIPE ROUTES

// GET recipes index

app.get('/api/v1/recipes', (req, res) => {
    db.Recipe.find({})
    .populate('reviews.user', 'firstName lastName _id')
    .exec((err, foundRecipes) => {
        if (err) return res.status(404).json({status: 404, error: 'Cannot find all recipes.'});

        res.json(foundRecipes);
    });
});

// GET recipe show

app.get('/api/v1/recipes/:id', (req, res) => {
    db.Recipe.findById(req.params.id, (err, foundRecipe) => {
        if (err) return res.status(404).json({status: 404, error: 'Cannot find one recipe.'})
        
        res.json(foundRecipe);
    });
});

// POST recipe create

app.post('/api/v1/recipes', (req, res) => {

    db.Recipe.create(req.body, (err, newRecipe) => {
        if (err) return res.status(404).json({status: 404, error: 'Cannot create recipe.'})

        res.json(newRecipe);
    });
})

// PUT recipe update
app.put('/api/v1/recipes/:id', (req, res) => {
    db.Recipe.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, updatedRecipe) => {
        if (err) return res.status(404).json({status: 404, error: 'Cannot update recipe.'})

        res.json(updatedRecipe);
    });
});

// DELETE recipe destroy
app.delete('/api/v1/recipes/:id', (req, res) => {
    db.Recipe.findByIdAndDelete(req.params.id, (err, deletedRecipe) => {
        if (err) return res.status(404).json({status: 404, error: 'Cannot deleted recipe.'})

        res.json(deletedRecipe);
    });
});





// Start Server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}/`));
