const { Schema, Types, model } = require('mongoose');
const Thought = require('./Thoughts');
const thoughtSchema = require('./Thoughts');
const userSchema = require('./Users');

const reactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId,
        },
        reactionBody: {
            type: String,
            required: true,
            maxlength: 280,
        },
        username: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,    
        },
    },
    {
        timestamps: true,
        toJSON: {
            getters: true,
            virtuals: true,
        },
        id: false,
    }
);

const Reaction = model('reaction', reactionSchema);

module.exports = Reaction;