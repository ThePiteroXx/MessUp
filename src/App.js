import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from 'hooks/auth/useAuthContext';
import { useFirestore } from 'hooks/useFirestore';
//styles
import './App.scss';

//pages
import Home from 'pages/Home';
import Login from 'pages/Login';
import Signup from 'pages/Signup';
import ForgotPassword from 'pages/ForgotPassword/ForgotPassword';
import ResetPassword from 'pages/ResetPassword';
import UserProfile from 'pages/UserProfile/UserProfile';
import AddUser from 'pages/AddUser/AddUser';
import Notifications from 'pages/Notifications/Notifications';
import Aside from 'components/Aside/Aside';

// providers
import { ChatContextProvider } from 'hooks/useChatContext';

// components
import Navbar from 'components/Navbar/Navbar';

const App = () => {
  const { authIsReady, user } = useAuthContext();
  const { updateDocument } = useFirestore('users');

  useEffect(() => {
    // update status user when he was leaving the page
    if (user) {
      let hidden, visibilityChange;
      updateDocument(user.uid, {
        isOnline: true,
      });

      // Set the name of the hidden property and the change event for visibility
      if (typeof document.hidden !== 'undefined') {
        // Opera 12.10 and Firefox 18 and later support
        hidden = 'hidden';
        visibilityChange = 'visibilitychange';
      } else if (typeof document.msHidden !== 'undefined') {
        hidden = 'msHidden';
        visibilityChange = 'msvisibilitychange';
      } else if (typeof document.webkitHidden !== 'undefined') {
        hidden = 'webkitHidden';
        visibilityChange = 'webkitvisibilitychange';
      }
      const handleVisibilityChange = () => {
        if (document[hidden]) {
          updateDocument(user.uid, {
            isOnline: false,
          });
        } else {
          updateDocument(user.uid, {
            isOnline: true,
          });
        }
      };
      window.addEventListener(visibilityChange, handleVisibilityChange, false);

      return () => window.removeEventListener(visibilityChange, handleVisibilityChange);
    }
  }, [user, updateDocument]);

  return (
    <div className={`app ${user && 'dashboard'}`}>
      {authIsReady && (
        <ChatContextProvider>
          <BrowserRouter>
            {user && <Aside />}
            <main className="container">
              <Navbar />
              <Routes>
                <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
                <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
                <Route path="/forgot-password" element={!user ? <ForgotPassword /> : <Navigate to="/" />} />
                <Route path="/reset-password" element={!user ? <ResetPassword /> : <Navigate to="/" />} />
                <Route path="/profile" element={user ? <UserProfile /> : <Navigate to="/" />} />
                <Route path="/add-user" element={user ? <AddUser /> : <Navigate to="/" />} />
                <Route path="/notifications" element={user ? <Notifications /> : <Navigate to="/" />} />
                <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
              </Routes>
            </main>
          </BrowserRouter>
        </ChatContextProvider>
      )}
    </div>
  );
};

export default App;
