const init = () => {

    const _this = this;

    _this.find = require('./find');
    _this.insert = require('./insert');
    _this.update = require('./update');
    _this.count = require('./count');
    _this.getAndPopulate = require('./get_and_populate');
    _this.delete = require('./delete');

    return _this;
}

module.exports = init()