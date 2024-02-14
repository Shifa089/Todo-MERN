import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAccount,
  updatePassowrd,
  updateProfilePhoto,
} from "../controllers/users.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(upload.single("profilePhoto"), registerUser);

router.route("/login").post(loginUser);

//secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccount);
router.route("/update-password").patch(verifyJWT, updatePassowrd);
router
  .route("/update-profilePhoto")
  .patch(verifyJWT, upload.single("profilePhoto"), updateProfilePhoto);
router.route("/refreshAccessToken").patch(verifyJWT, refreshAccessToken);

export default router;
