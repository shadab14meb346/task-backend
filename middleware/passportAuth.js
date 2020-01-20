const passport = require("passport");
const FacebookStrategy = require("passport-facebook");
let user = {};
//passport configurations

passport.serializeUser((user, cb) => {
	cb(null, user);
});

passport.deserializeUser((user, cb) => {
	cb(null, user);
});

passport.use(
	new FacebookStrategy(
		{
			clientID: 819757371814261,
			clientSecret: "6097b5ade6ef7f7439b4f66d40e129fc",
			callbackUrl: "/auth/facebook/callback"
		},
		(accessToken, refreshToken, profile, cb) => {
			console.log("TEST!", JSON.string(profile));
			user = { ...profile };
			return cb(null, profile);
		}
	)
);
