const { Schema, model } = require('mongoose');
const thoughtSchema = require('./Thoughts');

// Schema to create User model
const userSchema = new Schema(
  {
    /* **User**:
content criteria 
* `username`
* String
* Unique
* Required
* Trimmed */
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },

/*     * `email` content criteria
  * String
  * Required
  * Unique
  * Must match a valid email address (look into Mongoose's matching validation) */
    email: {
      type: String,
      required: function( ) {
        let pattern = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
        let matched = pattern.test(this.email);
        return matched;
      },
      unique: true,
      
    },

/* Array of `_id` values referencing the `Thought` model */
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Thought",
      }
    ],
     
  /* Array of `_id` values referencing the `User` model (self-reference) */
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      }
    ],
   
  },
  {
    toJSON: {
      getters: true,
    },
  }
);

/* 
Create a virtual called friendCount that retrieves the length of the user's friends array field on query. */
userSchema
  .virtual('friendCount')
  // 
  .get(function () {
    return this.friends.length;
  })

const User = model('User', userSchema);

module.exports = User;

