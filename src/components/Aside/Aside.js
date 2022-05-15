import { useDocument } from 'hooks/useCollection';
import { useAuthContext } from 'hooks/auth/useAuthContext';
import { useChatContext } from 'hooks/useChatContext';

// styles
import styles from './Aside.module.scss';

// components
import EditProfile from 'components/EditProfile/EditProfile';
import Friend from 'components/Friend/Friend';

const Aside = () => {
  const { user } = useAuthContext();
  const { dispatchChat } = useChatContext();

  const { document } = useDocument('users', ['uid', '==', user.uid]); // current logged in user document
  const friends = document ? document.friends : null;

  return (
    <aside className={styles.wrapper}>
      <EditProfile />
      {friends && (
        <div className={styles.friends}>
          {friends.length > 0 ? (
            friends.map((uid) => <Friend key={uid} friendUid={uid} currentUserUid={user.uid} dispatchChat={dispatchChat} />)
          ) : (
            <p style={{ textAlign: 'center' }}>You haven't any added friends</p>
          )}
        </div>
      )}
    </aside>
  );
};

export default Aside;
