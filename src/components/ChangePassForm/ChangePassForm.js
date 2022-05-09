import sanitizeHtml from 'sanitize-html';
import { useForm } from 'react-hook-form';
import { useChangePassword } from 'hooks/auth/useChangePassword';

// styles
import styles from './ChangePassForm.module.scss';

const ChangePassForm = () => {
  const { register, handleSubmit, reset } = useForm();
  const { changePassword, currentState, errorMessage, successMessage } = useChangePassword();

  const onSubmit = ({ oldPassword, newPassword }) => {
    changePassword(sanitizeHtml(oldPassword), sanitizeHtml(newPassword));
    reset({
      oldPassword: '',
      newPassword: '',
    });
  };

  return (
    <div className={styles.changePassWrapper}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label className="label">
          Old password:
          <input className="input" required type="password" {...register('oldPassword')} />
        </label>
        <label className="label">
          New password:
          <input className="input" required type="password" {...register('newPassword')} />
        </label>
        {currentState === 'loading' ? (
          <button className="btn" disabled>
            Loading...
          </button>
        ) : (
          <button className="btn">Submit</button>
        )}
        {currentState === 'error' && <p className="error">{errorMessage}</p>}
        {currentState === 'loaded' && <p className="success">{successMessage}</p>}
      </form>
    </div>
  );
};

export default ChangePassForm;
