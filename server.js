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

app.get('/recipes/:recipeId', (req, res) => {
    res.sendFile('views/recipe/showRecipe.html', {
        root: __dirname
    });
});

app.get('/breakfast', (req, res) => {
    res.sendFile('views/recipe/breakfast.html', {
        root: __dirname
    });
});

app.get('/lunch', (req, res) => {
    res.sendFile('views/recipe/lunch.html', {
        root: __dirname
    });
});

app.get('/dinner', (req, res) => {
    res.sendFile('views/recipe/dinner.html', {
        root: __dirname
    });
});

app.get('/dessert', (req, res) => {
    res.sendFile('views/recipe/dessert.html', {
        root: __dirname
    });
});

app.get('/user/profile', (req, res) => {
    res.sendFile('views/user/userProfile.html', {
        root: __dirname
    });
});

// -------------------- API RECIPE ROUTES

// GET recipes index

app.get('/api/v1/recipes', (req, res) => {
    db.Recipe.find({})
        .populate('reviews.user', 'firstName lastName _id')
        .exec((err, foundRecipes) => {
            if (err) return res.status(404).json({ status: 404, error: 'Cannot find all recipes.' });

            res.json(foundRecipes);
        });
});

// GET recipe show

app.get('/api/v1/recipes/:id', (req, res) => {
    db.Recipe.findById(req.params.id, (err, foundRecipe) => {
        if (err) return res.status(404).json({ status: 404, error: 'Cannot find one recipe.' })

        res.json(foundRecipe);
    });
});

// POST recipe create

app.post('/api/v1/recipes', (req, res) => {

    db.Recipe.create(req.body, (err, newRecipe) => {
        if (err) return res.status(404).json({ status: 404, error: 'Cannot create recipe.' })

        res.json(newRecipe);
    });
})

// PUT recipe update
app.put('/api/v1/recipes/:id', (req, res) => {
    db.Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, updatedRecipe) => {
        if (err) return res.status(404).json({ status: 404, error: 'Cannot update recipe.' })

        res.json(updatedRecipe);
    });
});

// DELETE recipe destroy
app.delete('/api/v1/recipes/:id', (req, res) => {
    db.Recipe.findByIdAndDelete(req.params.id, (err, deletedRecipe) => {
        if (err) return res.status(404).json({ status: 404, error: 'Cannot deleted recipe.' })

        res.json(deletedRecipe);
    });
});

// ---------------------------------------------API REVIEW ROUTES

//GET reviews index
app.get('/api/v1/reviews', (req, res) => {
    db.Review.find({}, (err, foundReviews) => {
        if (err) {
            return res.status(404).json({ status: 404, error: 'Cannot find all reviews.' });
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

//POST new review
app.post('/api/v1/recipes/:recipeId/reviews', (req, res) => {
    db.Review.create(req.body, (err, newReview) => {
        if (err) {
            return res.status(404).json({ status: 404, error: 'Cannot create a review.' });
        };

        db.Recipe.findById(req.params.recipeId, (err, foundRecipe) => {
            if (err) {
                return res.status(404).json({ status: 404, error: 'Cannot find a recipe to add review.' });
            };

            foundRecipe.reviews.push(newReview);
            foundRecipe.save((err, savedRecipe) => {
                if (err) {
                    return res.status(404).json({ status: 404, error: 'Cannot save a recipe with a new review.' });
                };

                res.json(savedRecipe);
            });
        });
    });
});

// PUT a review by id
app.put('/api/v1/recipes/:recipeId/reviews/:reviewId', (req, res) => {
    // console.log(req.params.reviewId); - reviewId

    db.Recipe.findById(req.params.recipeId, (err, foundRecipe) => {
        if (err) {
            return res.status(404).json({ status: 404, error: 'Cannot find a recipe to update review.' });
        };

        const reviewToUpdate = foundRecipe.reviews.id(req.params.reviewId);
        // console.log(reviewToUpdate);


        if (!reviewToUpdate) {
            return res.status(404).json({ status: 404, error: 'Cannot find a review to update.' });
        };

        reviewToUpdate.body = req.body.body;

        foundRecipe.save((err, savedRecipe) => {
            if (err) {
                return res.status(404).json({ status: 404, error: 'Cannot save a recipe with updated review.' });
            };

            db.Review.findByIdAndUpdate(req.params.reviewId, (err, updatedReview) => {
                if (err) {
                    return res.status(404).json({ status: 404, error: 'Cannot save a recipe with updated review.' });
                };

                res.json(updatedReview);
            });

            res.json(savedRecipe);
        });
    });
});

// DELETE a review by id
app.delete('/api/v1/recipes/:recipeId/reviews/:reviewId', (req, res) => {
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

// GET user show
app.get('/api/v1/users/:id', (req, res) => {
    db.User.findById(req.params.id, (err, User) => {
        if (err) return res.status(404).json({ status: 404, error: 'Cannot find users.' });

        res.json(User);
    })
})

// POST new user
app.post('/api/v1/users', (req, res) => {
    db.User.create(req.body, (err, newUser) => {
        if (err) return res.status(404).json({ status: 404, error: 'Cannot find users.' });

        res.json(newUser);
    });
});

// PUT a user by id
app.put('/api/v1/users/:id', (req, res) => {
    db.User.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, updatedUser) => {
        if (err) return res.status(404).json({ status: 404, error: 'Cannot find users.' });

        res.json(updatedUser);
    });
});

// DELETE a user by id
app.delete('/api/v1/users/:id', (req, res) => {
    db.User.findByIdAndDelete(req.params.id, (err, deletedUser) => {
        if (err) return res.status(404).json({ status: 404, error: 'Cannot find users.' });

        res.json(deletedUser);
    });
});


// ----------------- VIEW ROUTES

// VIEW INDEX

app.get('/', (req, res) => {
    res.sendFile('views/index.html', {
        root: __dirname 
    });
});

// VIEW SINGLE RECIPE

app.get('/recipes/:id', (req, res) => {
    res.sendFile('views/recipe/showRecipe.html', {
        root: __dirname 
    });
});



// Start Server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}/`));
