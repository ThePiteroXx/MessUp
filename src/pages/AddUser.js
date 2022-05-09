import sanitizeHtml from 'sanitize-html';
import { useForm } from 'react-hook-form';
import { useAddUser } from 'hooks/useAddUser';

const AddUser = () => {
  const { addUser, currentState, errorMessage, successMessage } = useAddUser();
  const { register, handleSubmit } = useForm();

  const onSubmit = ({ email }) => {
    addUser(sanitizeHtml(email));
  };
  return (
    <section>
      <h2 style={{ textAlign: 'center' }}>Add user</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <label className="label">
          <span>User's email address:</span>
          <input className="input" required type="email" {...register('email')} />
        </label>
        {currentState === 'loading' ? (
          <button className="btn" disabled>
            Adding...
          </button>
        ) : (
          <button className="btn" type="submit">
            Add
          </button>
        )}
        {currentState === 'error' && <p className="error">{errorMessage}</p>}
        {currentState === 'loaded' && <p className="success">{successMessage}</p>}
      </form>
    </section>
  );
};

export default AddUser;
