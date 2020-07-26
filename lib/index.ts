import {
  Strategy as JWTstrategy,
  ExtractJwt,
  StrategyOptions,
  VerifyCallbackWithRequest,
  VerifyCallback,
  VerifiedCallback,
} from "passport-jwt";
import { Request } from "express";
import TokenLoader from "./TokenLoader";

export default class FirebaseStrategy extends JWTstrategy {
  public static FirebaseSecretOrKeyProvider(
    _: Request,
    rawJwtToken: string,
    done: any
  ) {
    try {
      const header64 = rawJwtToken.split(".")[0];
      const header = JSON.parse(
        Buffer.from(header64, "base64").toString("ascii")
      );
      const secret = TokenLoader.Get(String(header.kid));
      return done(null, secret);
    } catch (err) {
      return done(err, null);
    }
  }
  public static DefaultVerfierCallBack(user: any, done: VerifiedCallback) {
    return done(null, user);
  }
  constructor(
    options: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    verify:
      | VerifyCallback
      | VerifyCallbackWithRequest = FirebaseStrategy.DefaultVerfierCallBack
  ) {
    super(
      {
        ...options,
        secretOrKeyProvider: FirebaseStrategy.FirebaseSecretOrKeyProvider,
      },
      verify
    );
  }
}

export { TokenLoader };
