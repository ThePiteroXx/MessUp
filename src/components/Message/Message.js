import { useRef, useEffect } from 'react';
import Moment from 'react-moment';

// styles
import styles from './Message.module.scss';

const Message = ({ msg, currentUser }) => {
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView();
  }, []);
  return (
    <div className={`${styles.wrapper} ${msg.from === currentUser ? styles.own : ''}`} ref={scrollRef}>
      <p className={msg.from === currentUser ? styles.me : styles.friend}>{msg.text}</p>
      <small>
        <Moment fromNow>{msg.createdAt.toDate()}</Moment>
      </small>
    </div>
  );
};

export default Message;
