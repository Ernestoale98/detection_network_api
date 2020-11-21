var express = require('express');
var router = express.Router();
var authMiddleware = require('../middlewares/authMiddleware');
//User service
var UserService = require('../../services/UserService');
//Validation to users/relation/interaction
const {
    userRelationInteractionValidationRules,
    userRelationInteractionValidate
} = require('../validators/userRelationInteractionValidator');
//Validation to users/relation
const {
    userRelationValidationRules,
    userRelationValidate
} = require('../validators/userRelationValidator');


/* GET auth user. */
router.get('/auth',
    authMiddleware,
    async (req, res) => {
        const user = await UserService.findById(req.user.id);
        res.json(user);
    });


/*POST user relation type of interaction.*/
router.post('/relation/interaction',
    authMiddleware,
    userRelationInteractionValidationRules(),
    userRelationInteractionValidate,
    async (req, res) => {
        await UserService.storeRelationOfInteraction(req.user.id, req.body.partner_id, req.body.relation_type).then(value => {
            res.json({partner: value});
        }).catch(error => {
            res.status(500).json(error);
        });
    });

/*POST user relation type of interaction.*/
router.post('/relation',
    authMiddleware,
    userRelationValidationRules(),
    userRelationValidate,
    async (req, res) => {
        await UserService.storeRelation(req.user.id, req.body.partner_id, req.body.relation_type).then(value => {
            res.json({partner: value});
        }).catch(error => {
            res.status(500).json(error);
        });
    });
module.exports = router;
