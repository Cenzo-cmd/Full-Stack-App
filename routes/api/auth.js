const express = require('express');
const router = express.Router();

//@route GET api/auth    @desc  test route     @access Public
router.get('/', (request, response) => {
    response.send('auth route');
});

module.exports = router;