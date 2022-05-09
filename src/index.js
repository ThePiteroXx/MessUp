import React from 'react';
import ReactDOM from 'react-dom';
import 'utils/scss/globalStyles.scss';
import App from './App';

//providers
import { AuthContextProvider } from 'context/AuthContext';

ReactDOM.render(
  <React.StrictMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
