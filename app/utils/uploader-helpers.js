const multer = require('multer');
const path = require('path');
const { ensureDir } = require('fs-extra');

exports.uploaderHelper = (uploadFolder = '../../admin/uploads', prefix = '', limit = { fieldSize: 500 * 1024 * 1024 }, filter = new RegExp(/\.(jpg|jpeg|png|gif|doc|docx|pdf)$/)) => {
    // Config storage
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = path.join(__dirname, uploadFolder);
            ensureDir(uploadPath)
                .then(() => cb(null, uploadPath))
                .catch(err => cb(err, null));
        },
        filename: (req, file, cb) => {
            const adjustPrefix = prefix ? `${prefix}-` : '';
            cb(null, `${adjustPrefix}${Date.now()}.${file.originalname.substring(file.originalname.lastIndexOf('.') + 1)}`);
        },
    });

    // Config filter
    const fileFilter = (req, file, cb) => {
        if (!file.originalname.match(filter)) {
            return cb({ err: 'Your file type is not accepted' });
        }
        return cb(null, true);
    };

    return multer({ storage, limit, fileFilter });
};
