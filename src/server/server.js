import app from './app';

const port = process.env.PORT || 3000;

if(!module.parent) {
  app.listen(port);
}

export default app;
