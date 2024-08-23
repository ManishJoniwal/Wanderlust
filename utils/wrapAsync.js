// it works same as try and catch. it is used for handling error

module.exports = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next)
    }
}