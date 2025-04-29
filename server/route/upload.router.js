import { Router } from 'express';
// import auth from '../middleware/auth.js'; // Uncomment if you need authentication
import uploadImageController from '../controllers/uploadImage.controller.js';
import upload from '../middleware/multer.js';

const uploadRouter = Router();

// Route for uploading an image
uploadRouter.post('/upload', upload.single('image'), uploadImageController);

export default uploadRouter;
