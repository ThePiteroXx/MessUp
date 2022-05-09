import { useState, useEffect } from 'react';
import useStateMachine from '@cassiozen/usestatemachine';

// firebase imports
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { auth } from 'utils/configs/firebaseConfig';

// configs
import { machineConfig, actions } from 'utils/configs/machineConfig';

export const useChangePassword = () => {
  const [machine, send] = useStateMachine(machineConfig);
  const [isCancelled, setIsCancelled] = useState(false);
  const user = auth.currentUser;

  const changePassword = async (oldPassowrd, newPassword) => {
    send(actions.fetch);

    try {
      const credential = EmailAuthProvider.credential(user.email, oldPassowrd);

      // require that the user has recently signed in
      await reauthenticateWithCredential(user, credential);

      // update password
      await updatePassword(user, newPassword);

      if (!isCancelled) {
        send({ type: actions.success, value: 'Your password has been changed.' });
        setTimeout(() => send(actions.reset), 5000);
      }
    } catch (err) {
      if (!isCancelled) {
        switch (err.code) {
          case 'auth/wrong-password':
            send({ type: actions.failure, value: 'Please enter the correct password' });
            break;
          case 'auth/weak-password':
            send({ type: actions.failure, value: 'Password should be at least 6 characters.' });
            break;
          case 'auth/too-many-requests':
            send({ type: actions.failure, value: 'Too many requests. Please try again later.' });
            break;
          default:
            send({ type: actions.failure, value: 'Something gone wrong!' });
        }
        setTimeout(() => send(actions.reset), 8000);
      }
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { changePassword, currentState: machine.value, errorMessage: machine.context.errorMessage, successMessage: machine.context.successMessage };
};
