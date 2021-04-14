const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport,getUserByName, getUserById){
    const authenticateUser = async (name, password, done) =>{
        const user = getUserByName(name)
        if(user == null){
            return done(null, false, {message: 'No user with that Username'})
        }

        try{
            if(await bcrypt.compare(password, user.password)){
                return done(null, user)
            }else{
                return done(null, false, { message: 'Password Incorrect'})
            }
        } catch (e){
            return done(e)
        }
    }
    passport.use( new LocalStrategy({ usernameField: 'name'},
     authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        done(null, getUserById(id))
    })
}

module.exports = initialize