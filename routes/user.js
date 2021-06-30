const express = require('express')

const {
    isLoggedIn
} = require('./middlewares')
const User = require('../models/user')

const router = express.Router()

// POST /user/1/follow // REST는 쫌 무리고 HTTP API정도로 볼 수 있겠다...
router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.findOne({where:{id:req.user.id}})
        if (user) {
            await user.addFollowings([parseInt(req.params.id, 10)])
            // setFollowings -> 통째로 대체 기존 데이터가 다 날라갈 수 있음..
            // removeFollowings, getFollowings
            res.send('success')
        } else {
            res.status(404).send('no user')
        }
    } catch (error) {
        console.error(error)
        next(error)
    }
})

module.exports = router