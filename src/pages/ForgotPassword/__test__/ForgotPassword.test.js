import { screen, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ForgotPassword from '../ForgotPassword';

const mockedUseForgotPassword = {
  forgotPassword: jest.fn(),
  currentState: 'empty',
  successMessage: 'success message',
  errorMessage: 'error message',
};

jest.mock('hooks/auth/useForgotPassword', () => ({
  useForgotPassword: () => ({
    forgotPassword: mockedUseForgotPassword.forgotPassword,
    currentState: mockedUseForgotPassword.currentState,
    successMessage: mockedUseForgotPassword.successMessage,
    errorMessage: mockedUseForgotPassword.errorMessage,
  }),
}));

describe('Forgot password', () => {
  it('Render <ForgotPassword />', () => {
    render(<ForgotPassword />);
    expect(screen.getByText(/Forgot password/i)).toBeTruthy();
  });

  it('Should call forgot password func on click add button', async () => {
    render(<ForgotPassword />);

    const emailInput = screen.getByLabelText(/Email address:/i);
    userEvent.type(emailInput, 'test@test.pl');

    const sendButton = screen.getByRole('button', { name: /Send/i });
    userEvent.click(sendButton);

    await waitFor(() => expect(mockedUseForgotPassword.forgotPassword).toHaveBeenCalled());
  });
});
