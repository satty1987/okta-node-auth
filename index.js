const express = require('express')
const app = express()
const port = 4200;

const session = require('express-session');
const { ExpressOIDC } = require('@okta/oidc-middleware');

const OktaJwtVerifier = require('@okta/jwt-verifier');

const oktaJwtVerifier = new OktaJwtVerifier({
    issuer: 'https://dev-337333.oktapreview.com/oauth2/default',
});

const oidc = new ExpressOIDC({
    issuer: 'https://dev-337333.oktapreview.com/oauth2/default',
    client_id: '0oarljwjo5OlifVJn0h7',
    client_secret: "FVMkSmE8DHnDEKiZZS1UU33ZXPrhrbkbGmOVc0fx",
    redirect_uri: 'http://localhost:4200/',
    appBaseUrl: 'http://localhost:4200',
    scope: 'openid profile'
});

app.use(session({
    secret: 'this-should-be-very-random',
    resave: true,
    saveUninitialized: false
}));
app.use(oidc.router);

app.get('/', oidc.ensureAuthenticated(), (req, res) => {
    res.send({ userInfo: req.userContext })
});
app.get("/verify", (req, res) => {
    if(req.userContext){
        oktaJwtVerifier.verifyAccessToken(req.userContext.tokens.access_token, 'api://default')
        .then(jwt =>{
            res.send(jwt)
        })
        .catch(err => {
            res.send(err)
        });
       
    }else{
        res.redirect('/');
    }



});
app.listen(port, () => console.log(`Example app listening on port port!`))