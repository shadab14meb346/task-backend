const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");

// @desc      Register user
// @route     POST /api/users/register
// @access    Public
exports.createUser = asyncHandler(async (req, res, next) => {
	const user = await User.create(req.body);
	res.status(201).json({
		success: true,
		data: user
	});
});

// @desc      Login user
// @route     POST /api/v1/auth/login
// @access    Public
exports.login = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;

	// Validate emil & password
	if (!email || !password) {
		return next(new ErrorResponse("Please provide an email and password", 400));
	}

	// Check for user
	const user = await User.findOne({ email }).select("+password");

	if (!user) {
		return next(new ErrorResponse("Invalid credentials", 401));
	}

	// Check if password matches
	const isMatch = await user.matchPassword(password);

	if (!isMatch) {
		return next(new ErrorResponse("Invalid credentials", 401));
	}

	sendTokenResponse(user, 200, res);
});

// Get token from model send response
const sendTokenResponse = (user, statusCode, res) => {
	// Create token
	const token = user.getSignedJwtToken();

	const options = {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
		),
		httpOnly: true
	};

	if (process.env.NODE_ENV === "production") {
		options.secure = true;
	}

	res.status(statusCode).json({
		success: true,
		token
	});
};
