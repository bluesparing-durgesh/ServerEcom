import { User } from './models/user'; // Adjust the path according to your project structure
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: User; // Add the user property here
    }
  }
}
