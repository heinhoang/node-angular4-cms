function ifeq(a, b, options) {
    if (a === b) {
        return options.fn(this);
    }
    return options.inverse(this);
}

function toJSON(object) {
    JSON.stringify(object);
}

exports.init = () => (
    {
        ifeq,
        toJSON,
    }
);
