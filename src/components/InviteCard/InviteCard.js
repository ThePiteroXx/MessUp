import { useCallback } from 'react';
import { useCollection } from 'hooks/useCollection';
import { useAuthContext } from 'hooks/auth/useAuthContext';
import Moment from 'react-moment';

// styles
import styles from './InviteCard.module.scss';

// components
import Avatar from '../Avatar/Avatar';

// firebase imports
import { db } from 'utils/configs/firebaseConfig';
import { updateDoc, doc, arrayUnion, deleteDoc } from 'firebase/firestore';

const InviteCard = ({ idDoc, uid, createdAt }) => {
  // the user who are you logged in
  const { user: currentUser } = useAuthContext();
  const { documents } = useCollection('users', ['uid', '==', uid]);

  // the user who invited you to friends
  const user = documents ? documents[0] : null;

  // remove request
  const removeRequest = useCallback(() => {
    deleteDoc(doc(db, 'invitations', idDoc));
  }, [idDoc]);

  // update user docs
  const confirmRequest = () => {
    if (user) {
      updateDoc(doc(db, 'users', user.uid), {
        friends: arrayUnion(currentUser.uid),
      });

      updateDoc(doc(db, 'users', currentUser.uid), {
        friends: arrayUnion(user.uid),
      });
      removeRequest();
    }
  };

  return (
    <>
      {user && (
        <div className={styles.wrapper}>
          <Avatar src={user.photoURL} />
          <div className={styles.content}>
            <span>
              <strong>{user.displayName}</strong> sent you a friend request
            </span>
            <small>
              <Moment fromNow>{createdAt.toDate()}</Moment>
            </small>
            <div className={styles.buttons}>
              <button className={`${styles.button} ${styles.buttonConfirm}`} onClick={confirmRequest}>
                Confirm
              </button>
              <button className={`${styles.button} ${styles.buttonRemove} `} onClick={removeRequest}>
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InviteCard;
