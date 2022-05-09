import { useCollection } from 'hooks/useCollection';
import { useAuthContext } from 'hooks/auth/useAuthContext';
import { useChatContext } from 'hooks/useChatContext';

// styles
import styles from './Aside.module.scss';

// components
import EditProfil from 'components/EditProfile/EditProfil';
import Friend from 'components/Friend/Friend';

const Aside = () => {
  const { user } = useAuthContext();
  const { dispatchChat } = useChatContext();

  // current user doc
  const { documents } = useCollection('users', ['uid', '==', user.uid]);
  const friends = documents ? documents[0].friends : null;

  return (
    <aside className={styles.wrapper}>
      <EditProfil />
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
