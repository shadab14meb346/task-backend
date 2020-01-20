const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");
const passport = require("passport");
const FacebookStrategy = require("passport-facebook");
// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
	let token;
	console.log(req.headers["x-auth-token"]);
	// token = req.cookies.token;
	if (req.headers["x-auth-token"] !== null) {
		token = req.headers["x-auth-token"];
	} else {
		return next(new ErrorResponse("Not authorized to access this route", 401));
	}
	try {
		// Verify token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		req.user = await User.findById(decoded.id);

		next();
	} catch (err) {
		return next(new ErrorResponse("Not authorized to access this route", 401));
	}
});

// Grant access to specific roles
exports.authorize = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(
				new ErrorResponse(
					`User role ${req.user.role} is not authorized to access this route`,
					403
				)
			);
		}
		next();
	};
};

//passport configurations

// exports.passport = asyncHandler(async (req, res, next) => {
// 	passport.serializeUser((user, cb) => {
// 		cb(null, user);
// 	});

// 	passport.deserializeUser((user, cb) => {
// 		cb(null, user);
// 	});

// 	passport.use(
// 		new FacebookStrategy(
// 			{
// 				clientID: 819757371814261,
// 				clientSecret: "6097b5ade6ef7f7439b4f66d40e129fc",
// 				callbackUrl: "/auth/facebook/callback"
// 			},
// 			(accessToken, refreshToken, profile, cb) => {
// 				console.log("TEST!", JSON.string(profile));
// 				user = { ...profile };
// 				return cb(null, profile);
// 			}
// 		)
// 	);
// });
