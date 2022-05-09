import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Navbar from '../Navbar';

const MockedNavbar = () => (
  <BrowserRouter>
    <Navbar />
  </BrowserRouter>
);

const mockData = {
  user: null,
  currentState: 'loaded',
};
jest.mock('hooks/auth/useAuthContext', () => ({
  useAuthContext: () => ({ user: mockData.user }),
}));

jest.mock('hooks/auth/useLogout', () => ({
  useLogout: () => ({
    logout: jest.fn(() => {
      mockData.user = null;
    }),
    currentState: mockData.currentState,
  }),
}));

describe('Navbar', () => {
  describe('When user is logged out', () => {
    it('Render <Navbar />', () => {
      render(<MockedNavbar />);
      expect(screen.queryByText(/Logout/i)).toBeFalsy();
      expect(screen.getByText(/Login/i)).toBeTruthy();
    });

    it('Click on the links and expect to change location path', () => {
      render(<MockedNavbar />);
      expect(window.location.pathname).toBe('/');
      const logo = screen.getByAltText(/messUp logo/i);
      const loginButton = screen.getByText(/Login/i);
      const signupButton = screen.getByText(/Signup/i);

      userEvent.click(loginButton);
      expect(window.location.pathname).toBe('/login');
      userEvent.click(signupButton);
      expect(window.location.pathname).toBe('/signup');
      userEvent.click(logo);
      expect(window.location.pathname).toBe('/');
    });
  });

  describe('When user is logged in', () => {
    beforeEach(() => {
      mockData.user = { displayName: 'mockedUser' };
    });

    it('Render <Navbar />', () => {
      render(<MockedNavbar />);
      const buttonLogout = screen.getByRole('button', { name: /Logout/i });
      expect(buttonLogout).toBeTruthy();
    });

    it('Click on the button and expect logout user', () => {
      const { rerender } = render(<MockedNavbar />);
      const buttonLogout = screen.getByRole('button', { name: /Logout/i });
      userEvent.click(buttonLogout);
      rerender(<MockedNavbar />);
      expect(screen.queryByText(/Logout/i)).toBeFalsy();
      expect(screen.getByText(/Signup/i)).toBeTruthy();
    });

    it('Render <Navbar /> when user is during logging out', () => {
      mockData.currentState = 'loading';
      render(<MockedNavbar />);
      const loadingButton = screen.getByRole('button', { name: /Logging out.../i });
      expect(loadingButton).toBeTruthy();
    });
  });
});
