import { useAuthContext } from 'hooks/auth/useAuthContext';
import { Link } from 'react-router-dom';

// styles
import styles from './EditProfile.module.scss';

// images
import { ReactComponent as Setting } from 'assets/icons/setting.svg';
import { ReactComponent as Notifications } from 'assets/icons/notifications.svg';
import { ReactComponent as UserAddIcon } from 'assets/icons/user-add.svg';

// components
import Avatar from '../Avatar/Avatar';

const EditProfil = () => {
  const { user } = useAuthContext();
  return (
    <div className={styles.wrapper}>
      <div className={styles.user}>
        <div className={styles.avatar}>
        <Avatar src={user.photoURL} />
        <Link to="/profile" className={styles['edit-btn']}>
          <Setting />
        </Link>
        </div>
        <p>{user.displayName}</p>
      </div>
      <div className={styles.icons}>
        <Link to="/notifications">
          <Notifications />
        </Link>
        <Link to="/add-user">
          <UserAddIcon />
        </Link>
      </div>
    </div>
  );
};

export default EditProfil;
