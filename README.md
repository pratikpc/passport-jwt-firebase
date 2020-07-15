# PASSPORT JWT FIREBASE

This Library helps you use JWT Strategy with Passport and Firebase Auth

Usage of this Library is very simple

## Functions

### `async TokenLoader.Load(timeout = 2 hours in MS)`
Used to Load Google Auth tokens

Updates Token List every 2 hours by default

If Tokens don't match during checking, tokens get updated again

Not mandatory to call this method although first time check may fail if not called

### `FirebaseStrategy`
Main Strategy used. Link it with passport using `passport.use(FirebaseStrategy);`

## [EXAMPLES](/samples/index.ts)
```
import express, { Application, Request, Response } from "express";
import bodyParser from "body-parser";
import passport from "passport";
import FirebaseStrategy, { TokenLoader } from "passport-jwt-firebase";

TokenLoader.Load(); // Note is Async
const app: Application = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

passport.use(FirebaseStrategy);
app.use(passport.initialize());

app.use(passport.authenticate('jwt', { session: false }));

app.use("/", passport.authenticate('jwt', { session: false }), (req: Request, res: Response) => {
    if(req.isUnauthenticated())
        return res.status(401);
    const user = {
        ...req.user!,
        authenticated: req.isAuthenticated()
    };
    console.log(user);
    return res.json(user);
});

const Port = Number(process.env.PORT || 8000);
app.listen(Port, err => {
    if (err) {
        return console.error(err);
    }
    console.log(`Server is listening on ${Port}`);
    console.log(`To Query, send Bearer token to localhost:${Port}`);
    console.log(`Generate Firebase Bearer Token at https://pratikpc.github.io/google-firebase-auth-token/`);
});

```