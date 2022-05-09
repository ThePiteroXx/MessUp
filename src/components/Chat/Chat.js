import { useCallback, useEffect, useState } from 'react';
import { useChatContext } from 'hooks/useChatContext';
import { useCollection } from 'hooks/useCollection';

// firebase
import { db } from 'utils/configs/firebaseConfig';
import { addDoc, collection, Timestamp, query, orderBy, onSnapshot, setDoc, doc, getDoc, updateDoc } from 'firebase/firestore';

// styles
import styles from './Chat.module.scss';

// components
import TextareaAutosize from 'react-textarea-autosize';
import { ReactComponent as Arrow } from 'assets/icons/arrow-left.svg';
import Avatar from '../Avatar/Avatar';
import Message from '../Message/Message';
import { useForm } from 'react-hook-form';

const Chat = ({ chat, currentUserUid }) => {
  const { documents } = useCollection('users', ['uid', '==', chat.user]);
  const friend = documents ? documents[0] : null; // the friend you are chatting
  const { dispatchChat } = useChatContext();
  const { register, handleSubmit, reset } = useForm();
  const [msgs, setMsgs] = useState([]);

  const onSubmit = useCallback(
    ({ message }) => {
      if (!message.replace(/\s/g, '').length) return;
      addDoc(collection(db, 'messages', chat.idChat, 'chat'), {
        text: message,
        from: currentUserUid,
        to: chat.user,
        createdAt: Timestamp.fromDate(new Date()),
      });
      setDoc(doc(db, 'lastMsg', chat.idChat), {
        text: message,
        from: currentUserUid,
        to: chat.user,
        createdAt: Timestamp.fromDate(new Date()),
        unread: true,
      });
      reset({ message: '' });
    },
    [currentUserUid, chat, reset]
  );

  const onEnterPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) e.target.nextElementSibling.click();
  };

  const onExitChat = useCallback(async () => {
    dispatchChat(null);

    const docSnapLastMsg = await getDoc(doc(db, 'lastMsg', chat.idChat));
    if (docSnapLastMsg.data()?.to === currentUserUid) {
      await updateDoc(doc(db, 'lastMsg', chat.idChat), { unread: false });
    }
  }, [currentUserUid, chat.idChat, dispatchChat]);

  // set messages user
  useEffect(() => {
    const msgsRef = collection(db, 'messages', chat.idChat, 'chat');
    const q = query(msgsRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push({ ...doc.data(), id: doc.id });
      });
      setMsgs(msgs);
    });

    return () => unsubscribe();
  }, [chat.idChat]);

  // set friend

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.back} onClick={onExitChat}>
          <Arrow />
        </div>
        {friend && (
          <div className={styles['header__user']}>
            <Avatar src={friend.photoURL} isOnline={friend.isOnline} size={'50px'} />
            <strong>{friend.displayName}</strong>
          </div>
        )}
      </div>
      <div className={styles.body}>{msgs.length > 0 ? msgs.map((msg) => <Message key={msg.id} msg={msg} currentUser={currentUserUid} />) : null}</div>
      <form className={styles['message-form']} onSubmit={handleSubmit(onSubmit)}>
        <TextareaAutosize className="input" placeholder="Enter your message" maxRows={4} {...register('message')} onKeyUp={onEnterPress} />
        <button className="btn" type="submit">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
