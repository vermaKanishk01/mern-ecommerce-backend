const express = require("express");
const { signup, login, forgotPassword, changePassword, resetPassword, getUserProfile, updateProfile } = require("../controllers/userController");
const { protect } = require("../middleware/protect");
const upload = require("../middleware/multer");

const userRouter = express.Router();

userRouter.post("/signup", upload.single("avatar"), signup);
userRouter.post("/login", login);

userRouter.post("/change-password", protect, changePassword);

userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password/:token", resetPassword);

userRouter.get("/me", protect, getUserProfile);
userRouter.put("/update-profile", protect, upload.single("avatar"), updateProfile);

module.exports = userRouter;