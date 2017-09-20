const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    content: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    article: {
        type: Schema.Types.ObjectId,
        ref: 'Article',
    },
});

CommentSchema.methods = {
    toJSON(user) {
        const {
            _id,
            body,
            createdAt,
            author,
        } = this;
        return {
            id: _id,
            body,
            createdAt,
            // author: author.toProfileJSON(user),
        };
    },
};

let Comment;
try {
    Comment = mongoose.model('Comment');
} catch (e) {
    Comment = mongoose.model('Comment', CommentSchema);
}

module.exports = Comment;
