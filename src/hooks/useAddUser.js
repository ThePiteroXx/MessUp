import { useFirestore } from './useFirestore';
import { useCollection } from './useCollection';
import useStateMachine from '@cassiozen/usestatemachine';

// firebase imports
import { db, auth } from '../utils/configs/firebaseConfig';
import { query, where, collection, getDocs } from 'firebase/firestore';

// configs
import { machineConfig, actions } from 'utils/configs/machineConfig';

export const useAddUser = () => {
  const user = auth.currentUser;
  const [machine, send] = useStateMachine(machineConfig); //machine of state menagement
  const { addDocument } = useFirestore('invitations');
  const { documents: userInvitations } = useCollection('invitations');

  const addUser = async (email) => {
    let searchedUser = null;
    send(actions.fetch);

    // search user with email
    const usersRef = collection(db, 'users');
    const querySearchedUser = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(querySearchedUser);
    querySnapshot.forEach((doc) => (searchedUser = doc.data()));

    // if the user is not found, exit function
    if (!searchedUser) {
      send({ type: actions.failure, value: 'Cannot search the user' });
      return;
    }
    // check if user is invited
    const isInvited = userInvitations.some(
      (e) => (e.addedUser === searchedUser.uid && e.addedBy === user.uid) || (e.addedUser === user.uid && e.addedBy === searchedUser.uid)
    );

    // check if user is your friends
    const isFriend = searchedUser.friends.some((e) => e === user.uid);

    // add new document of invitation if there is no error
    if (isInvited) {
      send({ type: actions.failure, value: 'This user is already invited or you are invited by a user' });
    } else if (searchedUser.uid === user.uid) {
      send({ type: actions.failure, value: 'You cannot add yourself to friends' });
    } else if (isFriend) {
      send({ type: actions.failure, value: 'You have this user in your friends' });
    } else {
      await addDocument({
        addedUser: searchedUser.uid,
        addedBy: user.uid,
      });
      send({ type: actions.success, value: 'The invitation was sent to the user' });
    }
  };

  return { addUser, currentState: machine.value, errorMessage: machine.context.errorMessage, successMessage: machine.context.successMessage };
};
