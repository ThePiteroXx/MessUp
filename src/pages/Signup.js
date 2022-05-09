import sanitizeHtml from 'sanitize-html';
import { useForm } from 'react-hook-form';
import { useSignup } from 'hooks/auth/useSignup';

const Signup = () => {
  const { handleSubmit, register } = useForm();
  const { signup, currentState, errorMessage } = useSignup();

  const onSubmit = ({ email, password, displayName }) => {
    const sanitizeEmail = sanitizeHtml(email);
    const sanitizePassword = sanitizeHtml(password);
    const sanitizeDisplayName = sanitizeHtml(displayName.toLowerCase(), {
      allowedTags: [],
      allowedAttributes: [],
    });
    signup(sanitizeEmail, sanitizePassword, sanitizeDisplayName);
  };

  return (
    <section>
      <h2 style={{ textAlign: 'center' }}>Sign Up</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <label className="label">
          <span>Email address:</span>
          <input className="input" required type="email" {...register('email')} />
        </label>
        <label className="label">
          <span>Password:</span>
          <input className="input" required type="password" {...register('password')} />
        </label>
        <label className="label">
          <span>Display name:</span>
          <input className="input" required type="text" maxLength={15} {...register('displayName')} />
        </label>
        {currentState === 'loading' ? (
          <button className="btn" disabled>
            Loading...
          </button>
        ) : (
          <button className="btn" type="submit">
            Sign up
          </button>
        )}
        {currentState === 'error' && <p className="error">{errorMessage}</p>}
      </form>
    </section>
  );
};

export default Signup;
