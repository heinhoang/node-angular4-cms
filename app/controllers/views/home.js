/**
 * GET /
 */
exports.index = (req, res) => {
    res.render('home', {
        title: req.t('title', { what: 'title' }),
    });
};
