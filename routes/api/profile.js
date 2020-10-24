const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

//@route GET api/profile/me    @desc  Get current user profile     @access Private
router.get('/me', auth, async(request, response) => {
    try {
        const profile = await Profile.findOne({ user: request.user.id }).populate('user', ['name', 'avatar']);

        if (!profile) {
            return response.status(400).json({ msg: 'There is no profile for this user' });
        }

        response.json(profile);
    } catch (err) {
        console.error(err.message);
        response.status(500).send('Server Error')
    }
});

//@route Post api/profile    @desc  Create of update user profile  @access Private
router.post('/', [auth, [
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills are required').not().isEmpty()
]], async(request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }

    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = request.body;

    //build profile object
    const profileFields = {};
    profileFields.user = request.user.id;

    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername;

    if (skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim());

    }

    //build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
        let profile = await Profile.findOne({ user: request.user.id });

        if (profile) {
            //update
            profile = await Profile.findOneAndUpdate({ user: request.user.id }, { $set: profileFields }, { new: true });

            return response.json(profile);
        }

        //create
        profile = new Profile(profileFields);

        await profile.save();
        response.json(profile);

    } catch (err) {
        console.error(err.message);
        response.status(500).send('Server Error');
    }

});

//@route get api/profile    @desc  get all profiles  @access public
router.get('/', async(request, response) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        response.json(profiles);
    } catch (error) {
        console.error(error.message);
        response.status(500).send('Server Error');
    }
});

//@route get api/profile/user/:user_id  @desc  get  profile by user id  @access public
router.get('/user/:user_id', async(request, response) => {
    try {
        const profile = await Profile.findOne({ user: request.params.user_id }).populate('user', ['name', 'avatar']);

        if (!profile) return response.status(400).json({ msg: 'Profile not found' });

        response.json(profile);

    } catch (error) {
        console.error(error.message);
        if (error.kind == 'ObjectId') {
            response.status(400).json({ msg: 'Profile not found' });
        }
        response.status(500).send('Server Error');
    }
});

//@route delete api/profile @desc delete profile, user and post  @access Private
router.delete('/', auth, async(request, response) => {
    // remove profile
    await Profile.findOneAndRemove({ user: request.user.id });
    //remove user
    await User.findOneAndRemove({ _id: request.user.id });

    response.json({ msg: 'User deleted' });
});

//@route put api/profile/experience @desc add profile experience  @access Private

router.put('/experience', [auth, [
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'Company is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty()
]], async(request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }

    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = request.body;

    const newExp = {
        //es6 syntax :   title: title
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }

    try {
        const profile = await Profile.findOne({ user: request.user.id });

        profile.experience.unshift(newExp);

        await profile.save();

        response.json(profile);
    } catch (error) {
        console.error(error.message);
        response.status(500).send('Server Error');
    }
});

//@route delete api/profile/experience/:exp_id @desc delete experience from profile   @access Private
router.delete('/experience/:exp_id', auth, async(request, response) => {
    try {
        const profile = await Profile.findOne({ user: request.user.id });

        //get remove index
        const removeIndex = profile.experience.map(item => item.id).indexOf(request.params.exp_id);

        profile.experience.splice(removeIndex, 1);

        await profile.save();

        response.json(profile);

    } catch (error) {
        console.error(error.message);
        response.status(500).send('Server Error');
    }
})

module.exports = router;