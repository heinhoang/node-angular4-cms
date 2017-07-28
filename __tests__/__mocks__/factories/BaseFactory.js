/**
 * BaseFatory
 */

class BaseFactory {
    /**
     * Return a list
     *
     * @public
     * @param {Number} count how many items to create
     * @param {Object} attrs (optional) add more attributes
     * @returns {Array} List of items
     */
    generateList(count, attrs = {}) {
        const list = [];
        let itemNum = count;

        while (itemNum) {
            list.push(this.generate(attrs));
            itemNum -= 1;
        }
        return list;
    }
}

module.exports = BaseFactory;
