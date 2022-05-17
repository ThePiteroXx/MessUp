import { useState, useEffect } from 'react';
import useStateMachine from '@cassiozen/usestatemachine';
import { useAuthContext } from './useAuthContext';

// firebase imports
import { auth, storage, db } from 'utils/configs/firebaseConfig';
import { getDownloadURL, ref } from 'firebase/storage';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { setDoc, doc, Timestamp } from 'firebase/firestore';

// configs
import { machineConfig, actions } from 'utils/configs/machineConfig';

export const useSignup = () => {
  const [machine, send] = useStateMachine(machineConfig);
  const [isCancelled, setIsCancelled] = useState(false);
  const { dispatch } = useAuthContext();

  const signup = async (email, password, displayName) => {
    send(actions.fetch);

    try {
      // check inputs
      if (!email.length || !password.length || !displayName.length) {
        throw new Error('There cannot be empty fields');
      } else if (displayName.length > 15) {
        throw new Error('Display name cannot be longer than 15 characters ');
      }

      // signup
      const res = await createUserWithEmailAndPassword(auth, email, password);

      if (!res) {
        throw new Error('Could not complete signup');
      }

      // set default image to user
      const defaulImagePath = 'default-images/default-user.jpg';
      const imgUrl = await getDownloadURL(ref(storage, defaulImagePath));

      // add display name and photoUrl to user
      await updateProfile(res.user, { displayName, photoURL: imgUrl });

      // create a user document
      await setDoc(doc(db, 'users', res.user.uid), {
        uid: res.user.uid,
        displayName,
        email,
        isOnline: true,
        photoURL: imgUrl,
        friends: [],
        createdAt: Timestamp.fromDate(new Date()),
      });

      // dispatch login action
      dispatch({ type: 'LOGIN', payload: res.user });
      if (!isCancelled) send(actions.success);
    } catch (err) {
      if (!isCancelled) {
        switch (err.code) {
          case 'auth/email-already-in-use':
            send({ type: actions.failure, value: 'The provided email is already in use by an existing user.' });
            break;
          case 'auth/weak-password':
            send({ type: actions.failure, value: 'Password should be at least 6 characters.' });
            break;
          case 'auth/invalid-email':
            send({ type: actions.failure, value: 'Your email is invalid. Check that the email you entered is correct.' });
            break;
          default:
            if (err.code) {
              send({ type: actions.failure, value: 'Please improve your signup form.' });
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

  return { signup, currentState: machine.value, errorMessage: machine.context.errorMessage };
};
