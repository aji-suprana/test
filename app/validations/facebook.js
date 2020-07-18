const { body, param, checkIf } = require('express-validator/check');

const setPageToken = () => {
    return [
        body('page_id').exists().not().isEmpty().isString()
    ]
}

const getRealTimeComments = () => {
    return [
        param('video_id').exists().not().isEmpty().isString().withMessage('Please provide a valid video id')
    ]
}

const getLiveVideoById = () => {
    return [
        param('video_id').exists().not().isEmpty().isString().withMessage('Please provide a valid video id')
    ]
}

const getLiveComments = () => {
    return [
        param('video_id').exists().not().isEmpty().isString().withMessage('Please provide a valid video id')
    ]
}

const getComments = () => {
    return [
        param('video_id').exists().not().isEmpty().isString().withMessage('Please provide a valid video id')
    ]
}

const getUserId = () => {
    return [
        body('comment_id').exists().not().isEmpty().isString().withMessage('Please provide a valid comment id'),
        body('message').exists().not().isEmpty().isString().withMessage('Please provide a valid message text')
    ]
}

const sendMessage = () => {
    return [
        body('recipient_id').exists().not().isEmpty().isString().withMessage('Please provide a valid comment id'),
        body('message').exists().not().isEmpty().isString().withMessage('Please provide a valid message text')
    ]
}

module.exports = {
    setPageToken,
    getLiveVideoById,
    getRealTimeComments,
    getLiveComments,
    getComments,
    getUserId,
    sendMessage
}