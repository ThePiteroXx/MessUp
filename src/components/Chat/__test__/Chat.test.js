import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { addDoc, setDoc } from 'firebase/firestore';
import Chat from '../Chat';

jest.mock('hooks/useChatContext', () => ({
  useChatContext: () => ({
    dispatchChat: jest.fn(),
  }),
}));

jest.mock('firebase/firestore');

jest.mock('hooks/useCollection', () => ({
  useDocument: () => ({
    document: {
      displayName: 'mockUser',
      isOnline: true,
      photoURL: 'mockUrl',
    },
  }),
  useCollectionWithSub: () => ({
    documents: [
      {
        id: 'mockID',
        from: 'janek',
        text: 'Hello mockUser',
        createdAt: { toDate: jest.fn() },
      },
      {
        id: 'mockID2',
        from: 'mockUser',
        text: 'Hello janek',
        createdAt: { toDate: jest.fn() },
      },
    ],
    currentState: 'loaded',
  }),
}));

window.HTMLElement.prototype.scrollIntoView = jest.fn();

const props = {
  chat: {
    user: 'uidUser',
    idChat: 'idChat',
  },
  currentUserUid: '21',
};

describe('Chat', () => {
  it('Render <Chat />', () => {
    render(<Chat {...props} />);
    expect(screen.getByText(/Hello mockUser/i)).toBeTruthy();
    expect(screen.getByText(/Hello janek/i)).toBeTruthy();
  });

  it('should click the button which send messeage and expect to call firestore functions', () => {
    render(<Chat {...props} />);
    const sendButtonMessage = screen.getByRole('button', { name: /Send/i });
    const textareaMessage = screen.getByRole('textbox', { name: '' });
    const form = screen.getByRole('form', { name: '' });
    expect(textareaMessage).toBeTruthy();
    userEvent.type(textareaMessage, 'Hikjkjkj');
    fireEvent.submit(form);
    screen.debug();
    expect(addDoc).toHaveBeenCalled();
  });
});
