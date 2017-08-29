import { Router } from 'express';
import { authenticate } from '../models/auth';

const router = Router();

// route for receiving a json web token

router.post('/', (req, res, next) => {
  authenticate(req.body)
  .then((response) => {
    res.status(200).json({
      token: response
    });
  })
  .catch((error) => {
    error.status = 404;
    next(error);
  });
});

export default router;
