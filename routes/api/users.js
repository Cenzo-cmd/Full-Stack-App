const express = require('express');
const router = express.Router();
// const { check, validationResult } = require('express-validator/check');
const { check, validationResult } = require('express-validator');

//@route POST api/users    @desc  register user     @access Public
router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }
    console.log(request.body);
    response.send('user route');
});

module.exports = router;