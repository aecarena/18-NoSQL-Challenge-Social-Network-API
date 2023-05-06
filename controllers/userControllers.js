const {ObjectId} = require('mongoose').Types;
const {User, Thought, Reaction} = require('../models/modelsIndex');


const friendCount = async () => {
    User.aggregate().count('usersFriendsCount')
    .then((numberOfFriends) => numberOfFriends);
};


const userThoughtsAndFriendData = async () => {
    User.aggregate([
        {$match: {_id: ObjectId}},  
        {$unwind: '$thoughts',},           
        {$unwind: '$friends'},              
        {$group: {_id: ObjectId, friendData: '$friends'}},
        {$sort: {username: 1}},
    ])
};

module.exports = {
    
    getUsers(req, res) {
        User.find()
        .then(async (users) => {
            const userObject = {users, friendCount: await friendCount()};
            res.json(userObject);
    })
    .catch((err) => res.status(500).json(err))
    },

    
    getSingleUser(req, res) {
        User.findOne({_id: req.params.userId})
        .select('-__v') 
        .then((user) => 
            !user
            ? res.status(404).json({message: 'No user with that ID'}) 
            : res.json({user, userThoughtsAndFriendData: userThoughtsAndFriendData(req.params.userId)}) 
            )
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
              });
    },

    
    createUser(req, res) {
        User.create(req.body) 
        .then((user) => res.json(user))
        .catch((err) => res.status(500).json(err));
    },

    
    updateUser(req, res) {
        User.findOneAndUpdate(
            {_id: req.params.userId},
            {$set: req.body},
            {runValidators: true, new: true}
        )
        .then((user) => 
        !user
            ? res.status(404).json({message: 'No user with this ID'})
            : res.json(user)
        )
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },

    
    deleteUser(req, res) {
        User.findOneAndDelete({_id: req.params.userId})
        .then((user) => 
            !user 
                ? res.status(404).json({message: 'No user with this ID'})
                : Thought.deleteMany({_id: {$in: user.thoughts} })
                )
                .then(()=> res.json({message: "User and thoughts deleted"}))
                .catch((err) => res.status(500).json(err));
    },

    
    addFriend(req, res) {
        User.findOneAndUpdate(
            {_id: req.params.userId}, 
            {$addToSet: {friends: req.params.friendsId}}, 
            {new: true} 
        )
        .then((user) =>
            !user
            ? res.status(404).json({message: 'Friend user was not found'})
            : res.json('Friend was added to the friends list')
        )
        .catch((err) => {
            res.status(500).json(err);
        })
    },


    
    removeFriend(req, res) {
        User.findOneAndUpdate(
            {_id: req.params.userId},
            {$pull: {friends: req.param.friendsId}}, 
            {new: true}          
        ) 
        .then((user) => 
            !user 
            ? res.status(404).json({message: 'No user with this ID'})
            : res.json({message: 'Friend was removed from the friends list'})
        )
        .catch((err) => res.status(500).json(err));
    }
};