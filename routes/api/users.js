const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
// const { check, validationResult } = require('express-validator/check');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');

//@route POST api/users    @desc  register user     @access Public
router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], async(request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = request.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            return response.status(400).json({ errors: [{ msg: 'User already exists' }] });
        }

        const avatar = gravatar.url(email, {
            //size  rating  default image id user does not have gravatar
            s: '200',
            r: 'pg',
            d: 'mm'
        })

        user = new User({
            name,
            email,
            avatar,
            password
        })

        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save();

        response.send('User registered');
    } catch (err) {
        console.error(err.message);
        response.status(500).send('Server error');
    }

    console.log(request.body);

});

module.exports = router;