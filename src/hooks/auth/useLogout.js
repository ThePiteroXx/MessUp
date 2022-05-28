import { useEffect, useState } from 'react';
import { useAuthContext } from './useAuthContext';
import { useChatContext } from 'hooks/useChatContext';
import useStateMachine from '@cassiozen/usestatemachine';

// firebase imports
import { auth, db } from 'utils/configs/firebaseConfig';
import { updateDoc, doc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

// configs
import { machineConfig, actions } from 'utils/configs/machineConfig';

export const useLogout = () => {
  const [machine, send] = useStateMachine(machineConfig); //machine of state menagement
  const [isCancelled, setIsCancelled] = useState(false);
  const { dispatch, user } = useAuthContext();
  const { dispatchChat } = useChatContext();

  const logout = async () => {
    send(actions.fetch);

    try {
      // update online status
      await updateDoc(doc(db, 'users', user.uid), {
        isOnline: false,
      });

      // sign the user out
      await signOut(auth);

      // dispatch logout action
      dispatch({ type: 'LOGOUT' });

      // clear chat
      dispatchChat(null);

      // update state
      if (!isCancelled) send(actions.success);
    } catch (err) {
      if (!isCancelled) send(actions.failure);
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { logout, currentState: machine.value };
};
