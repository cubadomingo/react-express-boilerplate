import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import userController from './controllers/user';
import authController from './controllers/auth';

dotenv.config();
const app = express();

// Namespace for API versioning

const namespace = '/api/v1';

if (process.env.NODE_ENV !== 'test') { app.use(morgan('dev')); }
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Routes

app.use(`${namespace}/authenticate`, authController);
app.use(`${namespace}/users`, userController);
app.use('*',function(req,res) {
  res.status(404).json({
    message: 'route does not exist'
  });
});

// Error handling

if (app.get('env') === 'production') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message.split(',').join(', '),
        error: err.status
    });
  });
}

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message.split(',').join(', '),
        error: err
    });
});

export default app;
