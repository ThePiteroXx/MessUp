import { useState, useEffect } from 'react';
import { useAuthContext } from './useAuthContext';
import useStateMachine from '@cassiozen/usestatemachine';

// firebase imports
import { auth, db } from 'utils/configs/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { updateDoc, doc } from 'firebase/firestore';

// configs
import { machineConfig, actions } from 'utils/configs/machineConfig';

export const useLogin = () => {
  const [machine, send] = useStateMachine(machineConfig); //machine of state menagement
  const [isCancelled, setIsCancelled] = useState(false);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    send(actions.fetch);

    try {
      // login
      const res = await signInWithEmailAndPassword(auth, email, password);

      // dispatch login action
      dispatch({ type: 'LOGIN', payload: res.user });

      // update online status
      await updateDoc(doc(db, 'users', res.user.uid), {
        isOnline: true,
      });
      if (!isCancelled) send(actions.success);
    } catch (err) {
      console.log(err.message, err.code);
      if (!isCancelled)
        switch (err.code) {
          case 'auth/wrong-password':
          case 'auth/user-not-found':
            send({
              type: actions.failure,
              value: 'Check that the password or email you entered is correct.',
            });
            break;
          case 'auth/too-many-requests':
            send({
              type: actions.failure,
              value:
                'Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later',
            });
            break;
          default:
            send({
              type: actions.failure,
              value: 'Something gone wrong.',
            });
        }
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { login, currentState: machine.value, errorMessage: machine.context.errorMessage };
};
