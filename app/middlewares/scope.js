const scope = async (req, res, next) => {
    if (_.has(req.user, 'userData.is_admin') && req.user.userData.is_admin === true) return next();

    req.query.user_id = req.user.userData.id

    return next();
}

module.exports = scope;