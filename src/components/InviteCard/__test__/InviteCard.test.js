import { render, screen, fireEvent } from '@testing-library/react';
import { updateDoc, deleteDoc } from 'firebase/firestore';
import InviteCard from '../InviteCard';

jest.mock('hooks/auth/useAuthContext', () => ({
  useAuthContext: () => ({ user: { uid: '2sa' } }),
}));

let mockDocs = [
  {
    displayName: 'test',
    photoURL: 'mockUrl',
    uid: '1',
  },
];
jest.mock('hooks/useCollection', () => ({
  useCollection: () => ({
    documents: mockDocs,
  }),
}));

jest.mock('firebase/firestore');

const renderComponent = () => render(<InviteCard idDoc="2as" uid="sa2" createdAt={{ toDate: jest.fn() }} />);

describe('Invite card', () => {
  beforeEach(() => {
    mockDocs = [
      {
        displayName: 'test',
        photoURL: 'mockUrl',
        uid: '1',
      },
    ];
  });

  it('Render <InviteCard />', () => {
    renderComponent();
    expect(screen.getByText(/sent you a friend request/i)).toBeTruthy();
  });

  it('Render <InviteCard /> and confirm invitation', () => {
    const { rerender } = renderComponent();
    expect(screen.getByText(/sent you a friend request/i)).toBeTruthy();

    const submitButton = screen.getByRole('button', { name: /Confirm/i });
    fireEvent.click(submitButton);
    expect(updateDoc).toHaveBeenCalled();
    expect(deleteDoc).toHaveBeenCalled();

    mockDocs = [];
    rerender();
    expect(screen.queryByText(/sent you a friend request/i)).toBeFalsy();
  });

  it('Render <InviteCard /> and decline invitation', () => {
    const { rerender } = renderComponent();
    expect(screen.getByText(/sent you a friend request/i)).toBeTruthy();

    const declineButton = screen.getByRole('button', { name: /Remove/i });
    fireEvent.click(declineButton);
    expect(updateDoc).not.toHaveBeenCalled();
    expect(deleteDoc).toHaveBeenCalled();

    mockDocs = [];
    rerender();
    expect(screen.queryByText(/sent you a friend request/i)).toBeFalsy();
  });
});
