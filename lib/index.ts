import { User } from "@firebase/auth-types";
import { Strategy as JWTstrategy, ExtractJwt } from "passport-jwt";
import { Request } from "express";
import TokenLoader from "./TokenLoader";

function FirebaseSecretOrKeyProvider(_: Request, rawJwtToken: string, done: any) {
    try {
        const header64 = rawJwtToken.split('.')[0];
        const header = JSON.parse(Buffer.from(header64, 'base64').toString('ascii'));
        const secret = TokenLoader.Get(String(header.kid));
        return done(null, secret);
    } catch (err) {
        return done(err, null);
    }
}

//This verifies that the token sent by the user is valid
const FirebaseStrategy = new JWTstrategy({
    secretOrKeyProvider: FirebaseSecretOrKeyProvider,
    //we expect the user to send the token as a query parameter with the name 'secret_token'
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}, async (token: User, done) => {
    try {
        //Pass the user details to the next middleware
        return done(null, token);
    } catch (error) {
        done(error, null);
    }
});

export default FirebaseStrategy;
export { TokenLoader };