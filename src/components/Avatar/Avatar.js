import styles from './Avatar.module.scss';

const Avatar = ({ src, size, isOnline }) => {
  if (src)
    return (
      <div className={`${styles.avatar} ${isOnline ? styles['is-online'] : ''}`} style={{ width: size, height: size }}>
        <img src={src} alt="user avatar" />
      </div>
    );
  else {
    return <div className={`${styles.avatar} skeleton`} style={{ width: size, height: size }} />;
  }
};

export default Avatar;
