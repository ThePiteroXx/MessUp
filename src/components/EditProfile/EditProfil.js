import { useAuthContext } from 'hooks/auth/useAuthContext';
import { Link } from 'react-router-dom';

// styles
import styles from './EditProfil.module.scss';

// images
import { ReactComponent as NewNotifications } from 'assets/icons/new-notifications.svg';
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
        <Avatar src={user.photoURL} />
        <p>{user.displayName}</p>
        <Link to="/profile">
          <div className={styles['edit-btn']}>
            <Setting />
          </div>
        </Link>
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
