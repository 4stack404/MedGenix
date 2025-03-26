import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { getUserData, uploadUserPhoto } from '../controllers/userController.js';
import { upload } from '../config/cloudinary.js';

const userRouter = express.Router();

userRouter.get('/data', userAuth, getUserData);
userRouter.post('/upload-photo', userAuth, upload.single('photo'), uploadUserPhoto);

export default userRouter;