const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    postText:{
        type: String,
        required: true,
    },
    image: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    likes: {
        type: Array,
        default: [],
    },
});

// Create the post model
module.exports = mongoose.model('posts', postSchema);
