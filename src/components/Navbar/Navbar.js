import { Link } from 'react-router-dom';
import { useAuthContext } from 'hooks/auth/useAuthContext';
import { useLogout } from 'hooks/auth/useLogout';

// styles & images
import styles from './Navbar.module.scss';
import Logo from 'assets/icons/logo.svg';

const Navbar = () => {
  const { logout, currentState } = useLogout();
  const { user } = useAuthContext();
  return (
    <nav className={styles.navbar}>
      <ul>
        <li className={styles.logo}>
          <Link to="/">
            <img src={Logo} alt="messUp logo" />
            <p>
              Mess<span>Up</span>
            </p>
          </Link>
        </li>
        {!user && (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/signup">Signup</Link>
            </li>
          </>
        )}
        {user && (
          <li>
            {currentState === 'loading' ? (
              <button className="btn" disabled>
                Logging out...
              </button>
            ) : (
              <button className="btn" onClick={logout}>
                Logout
              </button>
            )}
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
