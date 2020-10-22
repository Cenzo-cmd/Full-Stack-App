const express = require('express');
const router = express.Router();

//@route GET api/users    @desc  test route     @access Public
router.get('/', (request, response) => {
    response.send('user route');
});

module.exports = router;