import { useCollection } from 'hooks/useCollection';
import { useAuthContext } from 'hooks/auth/useAuthContext';

// components
import InviteCard from 'components/InviteCard/InviteCard';
import Loader from 'components/Loader/Loader';

const Notifications = () => {
  const { user } = useAuthContext();
  const { documents, currentState } = useCollection('invitations', ['addedUser', '==', user.uid], ['createdAt', 'desc']);

  return (
    <section style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      {currentState === 'loading' ? (
        <Loader />
      ) : documents.length > 0 ? (
        documents.map(({ id, addedBy, createdAt }) => <InviteCard key={id} idDoc={id} createdAt={createdAt} uid={addedBy} />)
      ) : (
        <p>You haven't any invitation</p>
      )}
    </section>
  );
};

export default Notifications;
