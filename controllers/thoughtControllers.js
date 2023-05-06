const {ObjectId} = require('mongoose').Types;
const {User, Reaction, Thought} = require('../models/modelsIndex');

module.exports = {

    
    getThoughts(req, res) {
        Thought.find() 
        .then((thoughts) => res.json(thoughts)) 
        .catch((err) => res.status(500).json(err));
    },

    
    getSingleThought(req, res) {
        Thought.findOne({_id: req.params.thoughtId}) 
        .then((thought) => 
            !thought 
            ? res.status(404).json({message: 'No thought with this ID'}) 
            : res.json(thought) 
        )
        .catch((err) => res.status(500).json(err));
    },

    
    createThought(req, res) {
        Thought.create(req.body)
        .then((thoughts) => res.json(thoughts))
        .catch((err) => {
            console.log(err);
            return res.status(500).json(err);
        })
    },

   
    updateThought(req, res) {
        Thought.findOneAndUpdate( 
            {_id: req.params.thoughtId},
            {$set: req.body},
            {runValidators: true, new: true}
        )
        .then((thought) => 
        !thought
            ? res.status(404).json({message: 'No thought with this ID'})
            : res.json(thought)
        )
        .catch((err) =>{
            res.status(500).json(err);
        });
    },

    
    deleteThought(req, res) {
        Thought.findOneAndRemove({_id: req.params.thoughtId}) 
        .then((thought) => 
            !thought 
                ? res.status(404).json({message: 'No thought with this ID'}) 
                : User.findOneAndUpdate(  
                    {users: req.params.userId}, 
                    {$pull: {users: req.params.userId}}, 
                    {new: true} 
                )
        )
        .then((user) => 
            !user
            ? res.status(404).json({message: 'No user id found with this thought'})
            : res.json({message: 'Thought deleted'})
        )
        .catch((err) => res.status(500).json(err));        
    },

    
    async createReaction(req, res) {
        console.log('Adding a reaction');
        console.log(req.body);

        const reaction = await Reaction
            .create(req.body)
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            }); 
        console.log(reaction);
        Thought.findOneAndUpdate(
            {_id: req.params.thoughtId},
            {$addToSet: {reactions: reaction._id}},  
            {new: true}
        )
        .then((thought) => 
            !thought
            ? res.status(404).json({message: 'No thought found with this ID'})
            : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },

    
    removeReaction(req, res) {
        console.log(req.params);
        Thought.findOneAndUpdate( 
            {_id: req.params.thoughtId}, 
            {$pull: {reactions: req.params.reactionId}}, 
            {runValidators: true, new: true}
        )
        .then((thought) => 
            !thought
                ? res.status(404).json({message: 'No thought found with this ID'})
                : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    }
};