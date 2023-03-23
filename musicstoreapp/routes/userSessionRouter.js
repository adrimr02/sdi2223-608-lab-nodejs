const userSessionRouter = require('express').Router()

userSessionRouter.use(function (req, res, next) {
    if (req.session.user)
        next()
    else
        res.redirect('/users/login')
})

module.exports = userSessionRouter