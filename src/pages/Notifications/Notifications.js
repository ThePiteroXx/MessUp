import { useCollection } from 'hooks/useCollection';
import { useAuthContext } from 'hooks/auth/useAuthContext';

// styles
import styles from './Notifications.module.scss';

// components
import InviteCard from 'components/InviteCard/InviteCard';
import Loader from 'components/Loader/Loader';

const Notifications = () => {
  const { user } = useAuthContext();
  const { documents, currentState } = useCollection('invitations', ['addedUser', '==', user.uid], ['createdAt', 'desc']);

  return (
    <section className={styles.wrapper}>
      {currentState === 'loading' ? (
        <Loader />
      ) : documents.length > 0 ? (
        <div className={styles.cards}>
          {documents.map(({ id, addedBy, createdAt }) => (
            <InviteCard key={id} idDoc={id} createdAt={createdAt} uid={addedBy} />
          ))}
        </div>
      ) : (
        <p>You haven't any invitation</p>
      )}
    </section>
  );
};

export default Notifications;
