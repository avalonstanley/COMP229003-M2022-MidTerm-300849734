var express = require('express');
var router = express.Router();

let carController = require('../controllers/car');

// Helper function for guard purposes
function requireAuth(req, res, next)
{
    // check if the user is logged in  <------------------------------------
    if(!req.isAuthenticated()){
        req.session.url=req.originalUrl;//copy the originalUrl to the session, so you can redirect the user back after a successful authentication
        return res.redirect('/users/signin');//redirect the user to the '/users/sign' page
    }
    next();  
}

/* GET list of items */
router.get('/list', carController.carList);

// Route for Details
router.get('/details/:id', carController.details);

// Routers for edit
router.get('/edit/:id', requireAuth, carController.displayEditPage);
router.post('/edit/:id', requireAuth, carController.processEditPage);

// Delete
router.get('/delete/:id', requireAuth, carController.performDelete);

/* GET Route for displaying the Add page - CREATE Operation */
router.get('/add', requireAuth, carController.displayAddPage);

/* POST Route for processing the Add page - CREATE Operation */
router.post('/add', requireAuth, carController.processAddPage);

module.exports = router;