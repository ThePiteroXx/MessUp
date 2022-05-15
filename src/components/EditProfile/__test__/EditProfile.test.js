import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import EditProfile from '../EditProfile';

const MockEditProfile = () => (
  <BrowserRouter>
    <EditProfile />
  </BrowserRouter>
);

jest.mock('hooks/auth/useAuthContext', () => ({
  useAuthContext: () => ({
    user: {
      displayName: 'fakeUser',
      photoURL: 'fakeUrl',
    },
  }),
}));

describe('Edit profile', () => {
  it('Render <EditProfile />', () => {
    render(<MockEditProfile />);
    expect(screen.getByText(/fakeUser/i)).toBeTruthy();
  });

  it('on click icons expect to change pathname', () => {
    render(<MockEditProfile />);
    const profileSettingButton = screen.getByRole('link', { name: /setting.svg/i });
    userEvent.click(profileSettingButton);
    expect(window.location.pathname).toBe('/profile');

    const notificationsButton = screen.getByRole('link', { name: /notifications.svg/i });
    userEvent.click(notificationsButton);
    expect(window.location.pathname).toBe('/notifications');

    const invitationButton = screen.getByRole('link', { name: /user-add.svg/i });
    userEvent.click(invitationButton);
    expect(window.location.pathname).toBe('/add-user');
  });
});
