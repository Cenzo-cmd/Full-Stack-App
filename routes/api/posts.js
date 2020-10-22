const express = require('express');
const router = express.Router();

//@route GET api/post    @desc  test route     @access Public
router.get('/', (request, response) => {
    response.send('post route');
});

module.exports = router;