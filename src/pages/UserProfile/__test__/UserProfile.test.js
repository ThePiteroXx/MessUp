import { screen, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import UserProfile from '../UserProfile';

jest.mock('firebase/auth');
jest.mock('firebase/storage');
jest.mock('hooks/auth/useChangePassword', () => ({
  useChangePassword: () => ({
    changePassword: jest.fn(),
    currentState: 'empty',
    successMessage: '',
    errorMessage: '',
  }),
}));

const mockUpdateDoc = jest.fn();
jest.mock('hooks/useFirestore', () => ({
  useFirestore: () => ({
    updateDocument: mockUpdateDoc,
  }),
}));

jest.mock('hooks/auth/useAuthContext', () => ({
  useAuthContext: () => ({
    user: {
      displayName: 'fakeUser',
      photoURL: 'fakeUrl',
      email: 'example@email.com',
      uid: 'fakeUID',
    },
  }),
}));

describe('User profile', () => {
  it('Render <UserProfile />', () => {
    render(<UserProfile />);
    expect(screen.getAllByText(/fakeUser/i)).toBeTruthy();
  });

  it('should call updateDoc and updateProfile when upload new avatar', async () => {
    ref.mockImplementation(() => 'Fakevalue');
    uploadBytes.mockResolvedValue({ ref: { fullPath: '' } });
    getDownloadURL.mockResolvedValue('fakevalue');

    render(<UserProfile />);
    const fakeFile = new File(['hello'], 'hello.png', { type: 'image/png' });
    const buttonUploadAvatar = screen.getByLabelText(/Choose a file/i);

    userEvent.upload(buttonUploadAvatar, fakeFile);
    expect(screen.getByLabelText(/Loading.../i)).toBeTruthy();

    await waitFor(() => expect(updateProfile).toHaveBeenCalled());
    expect(mockUpdateDoc).toHaveBeenCalled();

    expect(screen.queryByLabelText(/Loading.../i)).toBeFalsy();
  });
});
