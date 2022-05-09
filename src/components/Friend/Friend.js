import { useEffect, useState, useCallback } from 'react';
import { useCollection } from 'hooks/useCollection';
import { Link } from 'react-router-dom';

// styles
import styles from './Friend.module.scss';

// components
import Avatar from '../Avatar/Avatar';

// firebase
import { db } from 'utils/configs/firebaseConfig';
import { onSnapshot, doc, updateDoc, getDoc } from 'firebase/firestore';

const Friend = ({ friendUid, currentUserUid, dispatchChat }) => {
  const idChat = currentUserUid > friendUid ? `${currentUserUid + friendUid}` : `${friendUid + currentUserUid}`;
  const { documents, currentState } = useCollection('users', ['uid', '==', friendUid]);
  const [lastMsg, setLastMsg] = useState(null);

  //friend
  const user = documents ? documents[0] : null;

  const selectUser = useCallback(async () => {
    dispatchChat({ user: friendUid, idChat });
    const docSnapLastMsg = await getDoc(doc(db, 'lastMsg', idChat));
    if (docSnapLastMsg.data()?.to === currentUserUid) {
      await updateDoc(doc(db, 'lastMsg', idChat), { unread: false });
    }
  }, [friendUid, currentUserUid, dispatchChat, idChat]);

  // get last msg
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'lastMsg', idChat), (doc) => {
      setLastMsg(doc.data());
    });
    return () => unsub();
  }, [friendUid, currentUserUid, idChat]);

  if (currentState === 'loading')
    return (
      <div className={styles.wrapper} data-testid="friend-skeleton">
        <Avatar size={'60px'} />
        <div className={styles.body}>
          <strong className="skeleton-heading" style={{ marginBottom: '14px' }} />
          <p className="skeleton-text" />
        </div>
      </div>
    );

  if (currentState === 'loaded')
    return (
      <Link to="/" className={styles.wrapper} onClick={selectUser} data-testid="friend">
        <Avatar src={user.photoURL} size={'60px'} isOnline={user.isOnline} />
        {lastMsg?.to === currentUserUid && lastMsg?.unread ? <div className={styles.unread}>new</div> : null}
        <div className={styles.body}>
          <strong>{user.displayName}</strong>
          <p>
            {lastMsg?.from === currentUserUid && <span style={{ fontWeight: 600 }}>Me: </span>}
            {lastMsg ? lastMsg.text.substring(0, 18) : 'Send a message'}
            {lastMsg && lastMsg.text.length > 18 && '...'}
          </p>
        </div>
      </Link>
    );
};

export default Friend;
