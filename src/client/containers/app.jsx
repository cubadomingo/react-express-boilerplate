import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';
import configureStore from 'store/index';
import Home from 'components/home';

const store = configureStore();

export const App = () => (
  <BrowserRouter>
    <div>
      <Route exact path="/" component={Home} />
    </div>
  </BrowserRouter>
);

export default () => (
  <Provider store={store}>
    <App />
  </Provider>
);
