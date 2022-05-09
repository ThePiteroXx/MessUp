import sanitizeHtml from 'sanitize-html';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { useResetPassword } from 'hooks/auth/useResetPassword';
import { useNavigate } from 'react-router-dom';

const useQuery = () => {
  const location = useLocation();
  return new URLSearchParams(location.search);
};

const ResetPassword = () => {
  const { register, handleSubmit } = useForm();
  const { resetPassword, currentState, errorMessage, successMessage } = useResetPassword();
  const query = useQuery();
  const navigate = useNavigate();

  const onSubmit = ({ newPassword }) => {
    const sanitizeNewPassword = sanitizeHtml(newPassword);
    resetPassword(query.get('oobCode'), sanitizeNewPassword);
  };

  useEffect(() => {
    if (currentState === 'loaded') setTimeout(() => navigate('/login'), 3000);
  }, [currentState, navigate]);

  return (
    <section>
      <h2 style={{ textAlign: 'center' }}>Reset Password</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <label className="label">
          <span>New password:</span>
          <input className="input" required type="password" {...register('newPassword')} />
        </label>
        {currentState === 'loading' ? (
          <button className="btn" disabled>
            Reseting...
          </button>
        ) : (
          <button className="btn" type="submit">
            Reset
          </button>
        )}
        {currentState === 'error' && <p className="error">{errorMessage}</p>}
        {currentState === 'loaded' && <p className="success">{successMessage}</p>}
      </form>
    </section>
  );
};
export default ResetPassword;
