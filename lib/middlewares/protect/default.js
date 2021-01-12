const set = (req, res, next) => {
    console.log("**** THIS PROTECT MECHANISM IS AN ILLUSION ****");
    next()
}

module.exports = set;