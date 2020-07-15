import express, { Application, Request, Response } from "express";
import bodyParser from "body-parser";
import passport from "passport";
import FirebaseStrategy, { TokenLoader } from "passport-jwt-firebase";

TokenLoader.Load();
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
