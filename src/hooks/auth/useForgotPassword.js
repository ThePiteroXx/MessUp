import { useState, useEffect } from 'react';
import useStateMachine from '@cassiozen/usestatemachine';

// firebase imports
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from 'utils/configs/firebaseConfig';

// configs
import { machineConfig, actions } from 'utils/configs/machineConfig';

export const useForgotPassword = () => {
  const [machine, send] = useStateMachine(machineConfig); //machine of state menagement
  const [isCancelled, setIsCancelled] = useState(false);

  const forgotPassword = async (email) => {
    send(actions.fetch);

    try {
      await sendPasswordResetEmail(auth, email);

      if (!isCancelled) send({ type: actions.success, value: 'Email sent, check your email' });
    } catch (err) {
      if (!isCancelled) send({ type: actions.failure, value: 'The email you entered is incorrect. Check that the email you entered is correct.' });
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { forgotPassword, currentState: machine.value, successMessage: machine.context.successMessage, errorMessage: machine.context.errorMessage };
};
