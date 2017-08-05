const { uploaderHelper } = require('../utils/uploader-helpers');

/**
 * Uploader service
 * @param {String} uploadType multer upload control: `single`, `array`, `fields`
 * @param {String or Array} uploadArgs arguments of multer upload control
 * @param {Boolean} ctrType default false, if true this service will be controller
 * or else it'll be a middleware
 */
const uploader = (uploadType, uploadArgs, ctrType = false) => (req, res, next) => {
    const upload = uploadType === 'array' ?
        uploaderHelper()[uploadType](...uploadArgs) :
        uploaderHelper()[uploadType](uploadArgs);

    return upload(req, res, (err) => {
        if (err) {
            return ctrType ? res.json(JSON.stringify(err)) : next(JSON.stringify(err));
        }
        return ctrType ? res.json(JSON.stringify({ message: 'Uploaded successfully' })) : next();
    });
};

module.exports = uploader;
