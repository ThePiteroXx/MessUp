import { useForm } from 'react-hook-form';
import { useLogin } from 'hooks/auth/useLogin';
import sanitizeHtml from 'sanitize-html';

import { Link } from 'react-router-dom';

const Login = () => {
  const { register, handleSubmit } = useForm();
  const { login, currentState, errorMessage } = useLogin();

  const onSubmit = ({ email, password }) => {
    login(sanitizeHtml(email), sanitizeHtml(password));
  };

  return (
    <section>
      <h2 style={{ textAlign: 'center' }}>Login</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <label className="label">
          <span>Email address:</span>
          <input className="input" required type="email" {...register('email')} />
        </label>
        <label className="label">
          <span>Password:</span>
          <input className="input" required type="password" {...register('password')} />
        </label>
        <Link to="/forgot-password" className="link">
          Forgot password?
        </Link>
        {currentState === 'loading' ? (
          <button className="btn" disabled>
            Loading...
          </button>
        ) : (
          <button className="btn" type="submit">
            Log in
          </button>
        )}
        {currentState === 'error' && <p className="error">{errorMessage}</p>}
      </form>
    </section>
  );
};

export default Login;
