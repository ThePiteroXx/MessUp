import { useDocument } from 'hooks/useCollection';
import { useAuthContext } from 'hooks/auth/useAuthContext';
import { useChatContext } from 'hooks/useChatContext';

// components
import EditProfile from 'components/EditProfile/EditProfile';
import Friend from 'components/Friend/Friend';
import Chat from 'components/Chat/Chat';

const Home = () => {
  const { user } = useAuthContext();
  const { chat, dispatchChat } = useChatContext();

  const { document } = useDocument('users', ['uid', '==', user.uid]); // current logged in user document
  const friends = document ? document.friends : null;

  return (
    <section style={{ position: 'relative', width: '100%' }}>
      <div className="only-mobile" style={chat && { display: 'none' }}>
        <EditProfile />
        {friends && (
          <>
            {friends.length > 0 ? (
              friends.map((uid) => <Friend key={uid} friendUid={uid} currentUserUid={user.uid} dispatchChat={dispatchChat} />)
            ) : (
              <p style={{ textAlign: 'center' }}>You haven't any added friends</p>
            )}
          </>
        )}
      </div>
      {chat ? (
        <Chat chat={chat} currentUserUid={user.uid} />
      ) : (
        <p className="only-desktop" style={{ textAlign: 'center', fontSize: '1.4em', color: '#999' }}>
          Select friend to chating
        </p>
      )}
    </section>
  );
};

export default Home;
