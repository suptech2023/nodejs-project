const express=require('express')
const passport=require('passport')
const session=require('express-session')
const { profile } = require('console')
const GoogleStategy=require('passport-google-oauth20').Strategy

const app=express()
const port=3000
//La configuration de la session
app.use(session({
    secret:'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',
    resave:false,
    saveUninitialized:false
}))
//La condfiguration de la stratégie OAUth
passport.use(new GoogleStategy({
    clientID:'51295365315-60bcb3l90pmf0du0igdtr48ljose622b.apps.googleusercontent.com',
    clientSecret:'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',
    callbackURL:'http://localhost:3000/auth/google/callback'
},(accessToken,refreshToken,profile,done)=>{
    console.log('Autheticate User profile',profile)
    return done(null,profile)
}))
//La configuration de la sérialisation et désérialisation des utilisateurs
passport.serializeUser((user,done)=>{
    done(null,user)
})
passport.deserializeUser((user,done)=>{
    done(null,user)
})
//La configuration des Midlleware Passport
app.use(passport.initialize())
app.use(passport.session())
//La configuration des routes
//La route protégée
app.get('/',(request,response)=>{
   if(request.isAuthenticated()){
    response.send(`Welcome ${request.user.displayName}`)
   }
   else{
    response.redirect('/auth/google')
   }
})
//La route d'authentification avec google OAuth
app.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}))
//La route de rappel pour gérer la réponse de Google OAuth
app.get('/auth/google/callback',
passport.authenticate('google',{failureRedirect : '/login'}),
(request,response)=>{
    response.redirect('/')
})
//La route de la déconnexion
app.get('/logout',(request,response)=>{
    request.logOut(()=>{
        request.session.destroy()
        response.redirect('/')
    })
})

app.listen(port,()=>{
    console.log('Server Connected')
})