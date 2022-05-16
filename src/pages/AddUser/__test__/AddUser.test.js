import { screen, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddUser from '../AddUser';

const mockedUseAddUser = {
  addUser: jest.fn(),
  currentState: 'empty',
  successMessage: 'success message',
  errorMessage: 'error message',
};

jest.mock('hooks/useAddUser', () => ({
  useAddUser: () => ({
    addUser: mockedUseAddUser.addUser,
    currentState: mockedUseAddUser.currentState,
    successMessage: mockedUseAddUser.successMessage,
    errorMessage: mockedUseAddUser.errorMessage,
  }),
}));

describe('Add user', () => {
  beforeEach(() => {
    mockedUseAddUser.currentState = 'empty';
  });

  it('Render <AddUser />', () => {
    render(<AddUser />);
    expect(screen.getByText(/Add user/i)).toBeTruthy();
  });

  it('Render <AddUser /> if state useAddUser is loading', () => {
    mockedUseAddUser.currentState = 'loading';
    render(<AddUser />);
    expect(screen.getByText(/Add user/i)).toBeTruthy();

    const addButton = screen.queryByRole('button', { name: 'Add' });
    expect(addButton).toBeFalsy();

    const loadingButton = screen.getByRole('button', { name: /Adding.../i });
    expect(loadingButton).toBeTruthy();
  });

  it('Render <AddUser /> if state useAddUser is error', () => {
    mockedUseAddUser.currentState = 'error';
    render(<AddUser />);
    expect(screen.getByText(/error message/i)).toBeTruthy();
  });

  it('Render <AddUser /> if state useAddUser is loaded', () => {
    mockedUseAddUser.currentState = 'loaded';
    render(<AddUser />);
    expect(screen.getByText(/success message/i)).toBeTruthy();
  });

  it('Should call addUser func on click add button', async () => {
    render(<AddUser />);

    const emailInput = screen.getByLabelText(/User's email address:/i);
    userEvent.type(emailInput, 'test');

    const addButton = screen.getByRole('button', { name: /Add/i });
    userEvent.click(addButton);

    await waitFor(() => expect(mockedUseAddUser.addUser).toHaveBeenCalled());
  });
});
