const User = require("../model/userSchema");
const catchAsync = require("../utils/asynchandeler");
const AppError = require("../utils/Apperror");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


exports.registerUser = catchAsync(async (req, res, next) => {
  const { password } = req.body;
  const body = { ...req.body };
  const hashedpass = await bcrypt.hash(password, 10);
  body.password = hashedpass;
  const user = await User.create(body);
  const token = generateToken(user?._id);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: user,
    token: token,
  });
});


exports.signinuser = catchAsync(async (req, res, next) => {
  console.log("Calling 1")
  const { email } = req.body;
  const password = req?.body?.password?.trim()
  const user = await User.findOne({ email });
  if (!user) return next(new AppError("Provided emailid doesn't exists", 400));
  if(user?.status == "deleted") return next(new AppError("Provided emailid doesn't exists", 400))
    const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return next(new AppError("Wrong password", 400));
  console.log("Calling 2")
  const token = generateToken(user?._id);

  res.status(201).json({
    success: true,
    message: "User logged in successfully",
    data: user,
    token: token,
  });
});

exports.verifyuser = catchAsync(async(req,res,next)=>{
  const user = await User.findById(req.userId)
  res.status(201).json({
    success: true,
    message: "User fetched in successfully",
    data: user,
  });
})

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};







