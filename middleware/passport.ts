import passport from "passport";
import { Strategy as LocalStrategy,  } from "passport-local";
import {
  getUserByEmailIdAndPassword,
  getUserById,
} from "../controller/userController";


const localLogin = new LocalStrategy(
  {
    usernameField: "uname",
    passwordField: "password",
  },
  async (uname: string, password: string, done) => {
    try {
      const user = await getUserByEmailIdAndPassword(uname, password);
      return user
        ? done(null, user)
        : done(null, false, { message: "Your login details are not valid. Please try again." });
    } catch (err) {
      return done(err);
    }
  }
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await getUserById(id);
    if (user) {
      done(null, user);
    } else {
      done(new Error("User not found"), null);
    }
  } catch (err) {
    done(err, null);
  }
});

passport.use(localLogin);

passport.use(localLogin);
export default passport.use(localLogin);
