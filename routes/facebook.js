const express = require('express');
const router = express.Router();
const facebook = require('../app/controllers/facebook');
const facebookCommentListener = require('../app/controllers/facebook-comment-listener');
const validate = require('../app/middlewares/validation');
const validationRules = require('../app/validations/facebook');

/* GET live video listing. */
router.post('/send_message', validationRules.sendMessage(), validate, facebook.sendMessageFB); // for send message using recepient id
router.post('/get_user_id', validationRules.getUserId(), validate, facebook.getUserIdFB); // for getting recepient id from comment_id
router.get('/pages', facebook.getPages); // for getting all pages
router.post('/set_page_token', validationRules.setPageToken(), validate, facebook.setPageToken); // for getting page token
router.get('/', facebook.getLiveVideos); // for getting video
router.get('/:video_id', validationRules.getLiveVideoById(), validate, facebook.getLiveVideoById); // for getting video by id
router.get('/:video_id/get_comments', validationRules.getComments(), validate, facebook.getLiveComments); // for getting comment from video
router.get('/:video_id/realtime_comments', validationRules.getLiveComments(), validate, facebookCommentListener); // for getting realtime comment from live video

module.exports = router;
