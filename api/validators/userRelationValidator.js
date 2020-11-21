const {body, validationResult} = require('express-validator');
//Mongo User Instance
var User = require('../../models/user');

const userRelationValidationRules = () => {
    return [
        body('partner_id')
            .notEmpty().withMessage("partner_id is required")
            .custom(value => {
                return User.findById(value).then(user => {
                    if (!user) {
                        return Promise.reject('Partner id not exist ');
                    }
                })
            }),
        body('relation_type')
            .notEmpty().withMessage("relation_type is required")
            .isIn(['live_with', 'work_with'])
            .withMessage("relation_type only must be 'live_with' or 'work_with'")
    ];
}

const userRelationValidate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    return next();
}

module.exports = {
    userRelationValidationRules,
    userRelationValidate
}