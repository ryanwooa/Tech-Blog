const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { retrieveUserByUsername, retrieveUserById } = require('../modules/user-dao'); 

passport.use(
    new LocalStrategy(
        {
            usernameField: "username",
            passwordField: "password",
        },
        async (username, password, done) => {
            try {
                const user = await retrieveUserByUsername(username);
  
                if (!user) {
                    return done(null, false, { message: "wrong username or password" });
                }
  
                const match = await bcrypt.compare(password, user.password);
  
                if (!match) {
                    return done(null, false, { message: "wrong username or password" });
                }
  
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    )
      
);
console.log("passport.use");  

passport.serializeUser((user, done) => {
    done(null, user.user_id);
});
console.log("passport.serializeUser");
  
passport.deserializeUser(async (id, done) => {
    
    try {
        const user = await retrieveUserById(id);
  
        if (!user) {
            return done(null, false);
        }
  
        return done(null, user);
    } catch (error) {
        return done(error);
    }
});
console.log("passport.deserializeUser");

module.exports = passport;
