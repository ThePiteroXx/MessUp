import sanitizeHtml from 'sanitize-html';
import { useForm } from 'react-hook-form';
import { useForgotPassword } from 'hooks/auth/useForgotPassword';

const ForgotPassword = () => {
  const { register, handleSubmit } = useForm();
  const { forgotPassword, currentState, errorMessage, successMessage } = useForgotPassword();

  const onSubmit = ({ email }) => {
    forgotPassword(sanitizeHtml(email));
  };

  return (
    <section>
      <h2 style={{ textAlign: 'center' }}>Forgot password</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <label className="label">
          <span>Email address:</span>
          <input className="input" required type="email" {...register('email')} />
        </label>
        {currentState === 'loading' ? (
          <button className="btn" disabled>
            Sending...
          </button>
        ) : (
          <button className="btn" type="submit">
            Send
          </button>
        )}
        {currentState === 'error' && <p className="error">{errorMessage}</p>}
        {currentState === 'loaded' && <p className="success">{successMessage}</p>}
      </form>
    </section>
  );
};
export default ForgotPassword;
