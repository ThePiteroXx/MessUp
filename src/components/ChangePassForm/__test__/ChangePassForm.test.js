import { screen, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChangePassForm from '../ChangePassForm';

const state = {
  currentState: 'empty',
  successMessage: 'your password has been loaded',
  errorMessage: 'something gone wrong!',
};
const mockChangePassword = jest.fn();
jest.mock('hooks/auth/useChangePassword', () => ({
  useChangePassword: () => ({
    changePassword: mockChangePassword,
    currentState: state.currentState,
    successMessage: state.successMessage,
    errorMessage: state.errorMessage,
  }),
}));

describe('Change password form', () => {
  beforeEach(() => {
    state.currentState = 'empty';
  });

  it('Should call changePassword on sent if form is valid', async () => {
    render(<ChangePassForm />);
    const changePassButton = screen.getByRole('button', { name: /Submit/i });
    userEvent.click(changePassButton);
    await waitFor(() => expect(mockChangePassword).toHaveBeenCalled());
  });

  it('Should display success message if changePassword func was loaded successfully', () => {
    state.currentState = 'loaded';
    render(<ChangePassForm />);
    expect(screen.getByText(/your password has been loaded/i)).toBeTruthy();
  });

  it('Should display error message if changePassword func was not loaded successfully', () => {
    state.currentState = 'error';
    render(<ChangePassForm />);
    expect(screen.getByText(/something gone wrong!/i)).toBeTruthy();
  });

  it('Should clear inputs if message has been sent', async () => {
    render(<ChangePassForm />);
    const oldPasswordInput = screen.getByLabelText(/Old password:/i);
    userEvent.type(oldPasswordInput, 'test');
    expect(oldPasswordInput.value).toBe('test');

    const newPasswordInput = screen.getByLabelText(/New password:/i);
    userEvent.type(newPasswordInput, 'test2');
    expect(newPasswordInput.value).toBe('test2');

    const changePassButton = screen.getByRole('button', { name: /Submit/i });
    userEvent.click(changePassButton);

    await waitFor(() => expect(oldPasswordInput.value).toBe(''));
    expect(newPasswordInput.value).toBe('');
  });
});
