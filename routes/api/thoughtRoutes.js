const router = require ('express').Router();

const{
    getThoughts,        
    getSingleThought,   
    createThought,      
    updateThought,      
    deleteThought,      
    createReaction,     
    removeReaction,     
} = require('../../controllers/thoughtControllers');

router.route('/').post(createThought).get(getThoughts);

router.route('/:thoughtId').get(getSingleThought).put(updateThought).delete(deleteThought);

router.route('/:thoughtId/reactions').post(createReaction);

router.route('/:thoughtId/:reactionId').delete(removeReaction);

module.exports = router;