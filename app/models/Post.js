const mongoose = require('mongoose');
const slug = require('slug');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;
const User = mongoose.model('User');

const ArticleSchema = new Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Title is required!'],
        minlength: [3, 'Title must be longer!'],
        unique: true,
    },
    content: {
        type: String,
        required: [true, 'Some text are required!'],
    },
    slug: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Author is required!'],
    },
    favoriteCount: {
        type: Number,
        default: 0,
    },
    addedBy: {
        type: String,
        trim: true,
    },
    addedOn: {
        type: Date,
        default: Date.now,
    },
    updatedBy: {
        type: String,
        trim: true,
    },
    updatedOn: {
        type: Date,
    },
    deletedBy: {
        type: String,
        trim: true,
    },
    deletedOn: {
        type: Date,
    },
},
    { timestamps: true });

// Plugin Hooks
ArticleSchema.plugin(uniqueValidator, {
    message: '{VALUE} already taken!',
});

// Hooks
ArticleSchema.pre('validate', function createSlug(next) {
    this.slugify();
    next();
});

// Helper Methods
ArticleSchema.statics = {
    /**
     * Create a post
     *
     * @public
     * @param {Object} args - Object contains title and text
     * @param {String} authorId - the author id
     * @returns {Post} Post Object - new post create
     */
    createPost(args, authorId) {
        return this.create({
            ...args,
            author: authorId,
        });
    },

    /**
     * If you call list() with zero arguments, the destructuring fails,
     * because you can’t match an object pattern against undefined.
     * That can be fixed via a default value. In the following code,
     * the object pattern is matched against {} if there isn’t at least one argument.
     */
    list({ skip = 0, limit = 10 } = {}) {
        return this.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('author');
    },

    // incFavoriteCount(articleId) {
    //     return this.findByIdAndUpdate(articleId, { $inc: { favoriteCount: 1 } });
    // },

    // decFavoriteCount(articleId) {
    //     return this.findByIdAndUpdate(articleId, { $inc: { favoriteCount: -1 } });
    // },
};

// Methods
ArticleSchema.methods = {
    /**
     * Slug the title and add this to the slug prop
     */
    slugify(reSlug = true) {
        let randomStr = Math.random() * (36 ** 6) || 0;
        randomStr = reSlug ? randomStr.toString(36) : '';
        this.slug = slug(this.title + randomStr);
    },

    updateFavoriteCount() {
        const article = this;
        const { _id } = this;

        return User.count({ favorites: { $in: [_id] } }).then((count) => {
            article.favoritesCount = count;
            return article.save();
        });
    },
    /**
     * Parse the post in format we want to send.
     *
     * @public
     * @returns {Post} Post Object
     */
    toJSON() {
        const {
            _id,
            title,
            content,
            author,
            createdAt,
            favoriteCount,
        } = this;
        return {
            _id,
            title,
            content,
            author,
            createdAt,
            favoriteCount,
        };
    },
};

let Article;
try {
    Article = mongoose.model('Article');
} catch (e) {
    Article = mongoose.model('Article', ArticleSchema);
}

module.exports = Article;
