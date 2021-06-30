const passport = require('passport')
const local = require('./localStrategy')
const kakao = require('./kakaoStrategy')
const User = require('../models/user')

module.exports = () => {
    passport.serializeUser((user, done) => {
        done(null, user.id) // 세선에 user의 id만 저장
    })

    // { id: 3, 'connect.sid': s%318029309802983} 세션쿠키랑 id 매칭.
    // id만 추려서 저장했다가 필요할 때 다시 deserialize로 복구한다.

    passport.deserializeUser((id, done) => {
        // req.user는 여기서 생성된다!
        User.findOne({
                where: {
                    id
                },
                include: [{
                    model: User,
                    attributes: ['id', 'nick'],
                    as: 'Followers',
                }, {
                    model: User,
                    attributes: ['id', 'nick'],
                    as: 'Followings',
                }],
            })
            .then(user => done(null, user)) // req.user, req.isAuthenticated()
            .catch(err => done(err))
    })

    local()
    kakao()
}