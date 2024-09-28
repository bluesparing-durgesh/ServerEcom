import multer, { FileFilterCallback } from "multer";
import path from "path";
import { Request } from "express"; 
const storage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void): void {
    cb(null, './uploads/');  
  },
  filename: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void): void {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});


const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
  
  if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    cb(null, true);
  } else {
    cb(null, false);  
    req.fileValidationError = "Invalid file type. Only Excel files are allowed.";
  }
};


const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

export default upload;
