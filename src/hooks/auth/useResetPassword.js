import { useState, useEffect } from 'react';
import useStateMachine from '@cassiozen/usestatemachine';

// firebase imports
import { confirmPasswordReset } from 'firebase/auth';
import { auth } from 'utils/configs/firebaseConfig';

// configs
import { machineConfig, actions } from 'utils/configs/machineConfig';

export const useResetPassword = () => {
  const [machine, send] = useStateMachine(machineConfig); //machine of state menagement
  const [isCancelled, setIsCancelled] = useState(false);

  const resetPassword = async (oobCode, newPassword) => {
    send(actions.fetch);

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);

      if (!newPassword.length) throw new Error('Input cannot be empty');

      if (!isCancelled) {
        send({ type: actions.success, value: 'Your password has been reset. Go to the login page.' });
      }
    } catch (err) {
      if (!isCancelled) {
        switch (err.code) {
          case 'auth/internal-error':
            send({ type: actions.failure, value: 'You cannot change password. You must enter here with your e-mail.' });
            break;
          case 'auth/weak-password':
            send({ type: actions.failure, value: 'Password should be at least 6 characters.' });
            break;
          default:
            if (err.code) {
              send({ type: actions.failure, value: 'Something gone wrong' });
            } else {
              const errorMess = err.toString().replace('Error: ', '');
              send({ type: actions.failure, value: errorMess });
            }
        }
      }
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { resetPassword, currentState: machine.value, errorMessage: machine.context.errorMessage, successMessage: machine.context.successMessage };
};
