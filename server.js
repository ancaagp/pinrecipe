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

// ---------------------------------------------API REVIEW ROUTES

//GET reviews index
app.get('/api/v1/reviews', (req, res) => {
    db.Review.find({}, (err, foundReviews) => {
        if (err) {
            return res.status(404).json({status: 404, error: 'Cannot find all reviews.'});
        }

        res.json(foundReviews);
    });
});

//GET review show
// app.get('/api/v1/recipes/:id/reviews/:id', (req, res) => {
//     db.Review.findById(req.params.id, (err, foundReview) => {
//         if (err) {
//             return res.status(404).json({status: 404, error: 'Cannot find a review by id.'});
//         };

//         res.json(foundReview);
//     });
// });

// *******************************************************************************************************************************
//POST new review
app.post('/api/v1/recipes/:recipeId/reviews', (req, res) => {
    db.Review.create(req.body, (err, newReview) => {
        if (err) {
            return res.status(404).json({status: 404, error: 'Cannot create a review.'});
        };

        db.Recipe.findById(req.params.recipeId, (err, foundRecipe) => {
            if (err) {
                return res.status(404).json({status: 404, error: 'Cannot find a recipe to add review.'});
            };

            foundRecipe.reviews.push(newReview);
            foundRecipe.save((err, savedRecipe) => {
                if (err) {
                    return res.status(404).json({status: 404, error: 'Cannot save a recipe with a new review.'});
                };

                res.json(savedRecipe);
            });
        });
    });
});

// PUT a review by id
app.put('/api/recipes/:recipeId/reviews/:reviewId', (req, res) => {
    db.Recipe.findById(req.params.recipeId, (err, foundRecipe) => {
        if (err) {
            return res.status(404).json({status: 404, error: 'Cannot find a recipe to update review.'});
        };

        const reviewToUpdate = foundRecipe.reviews.id(req.params.reviewId);
        if (!reviewToUpdate) {
            return res.status(404).json({status: 404, error: 'Cannot find a review to update.'});
        };

        reviewToUpdate.update({_id: req.params.reviewId}, req.body);

        foundRecipe.save((err, savedRecipe) => {
            if (err) {
                return res.status(404).json({status: 404, error: 'Cannot save a recipe with updated review.'});
            };

            db.Review.findByIdAndDelete(req.params.reviewId, (err, deletedReview) => {
                if (err) {
                    return res.status(404).json({status: 404, error: 'Cannot save a recipe with updated review.'});
                };

                res.json(deletedReview);
            });
        });
    });
});

// *******************************************************************************************************************************


// DELETE a review by id
app.delete('/api/v1/recipes:recipeId/reviews/:reviewId', (req, res) => {
    db.Recipe.findById(req.params.recipeId, (err, foundRecipe) => {
        if (err) return res.status(404).json({ status: 404, error: 'Cannot find a recipe to delete review' });

        const reviewToDelete = foundRecipe.reviews.id(req.params.reviewId);

        if (!reviewToDelete) {
            return res.status(404).json({ status: 404, error: 'Cannot find a review to delete.' });
        };

        reviewToDelete.remove();

        foundRecipe.save((err, savedRecipe) => {
            if (err) return res.status(404).json({ status: 404, error: 'Cannot save recipe with deleted review' });

            db.Review.findByIdAndDelete(req.params.reviewId, (err, deletedReview) => {
                if (err) return res.status(404).json({ status: 404, error: 'Cannot delete a review' });
                res.json(deletedReview);
            });
        });
    });
});


// ---------------------------------------------API USER ROUTES

//GET users index

//GET user show

//POST new user

// PUT a user by id

// DELETE a user by id


// Start Server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}/`));
