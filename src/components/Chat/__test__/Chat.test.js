import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { addDoc, setDoc, getDoc } from 'firebase/firestore';
import Chat from '../Chat';

const mockDispatchChat = jest.fn();
jest.mock('hooks/useChatContext', () => ({
  useChatContext: () => ({
    dispatchChat: mockDispatchChat,
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

  it('Should not send message if textarea data does not contain any words', async () => {
    render(<Chat {...props} />);
    const sendButtonMessage = screen.getByRole('button', { name: /Send/i });
    const textareaMessage = screen.getByRole('textbox', { name: '' });

    userEvent.type(textareaMessage, '   '); // empty textarea with spaces
    userEvent.click(sendButtonMessage);
    await waitFor(() => expect(addDoc).not.toHaveBeenCalled());
    expect(setDoc).not.toHaveBeenCalled();
  });

  it('On click the button send message and expect to call submit function if input is populated', async () => {
    render(<Chat {...props} />);
    const sendButtonMessage = screen.getByRole('button', { name: /Send/i });
    const textareaMessage = screen.getByRole('textbox', { name: '' });

    userEvent.type(textareaMessage, 'some text');
    userEvent.click(sendButtonMessage);
    await waitFor(() => expect(addDoc).toHaveBeenCalled());
    expect(setDoc).toHaveBeenCalled();
  });

  it('On click arrow back expect call dispatchChat', () => {
    getDoc.mockImplementation(() => ({ data: jest.fn(() => ({ to: ' fakeUid' })) }));

    render(<Chat {...props} />);
    const exitButton = screen.getByTestId(/exit-chat/i);
    userEvent.click(exitButton);
    expect(mockDispatchChat).toHaveBeenCalled();
  });

  it('On press enter should call sumbit function', async () => {
    render(<Chat {...props} />);

    const textareaMessage = screen.getByRole('textbox', { name: '' });
    userEvent.type(textareaMessage, 'some text');
    userEvent.keyboard('{enter}');

    await waitFor(() => expect(addDoc).toHaveBeenCalled());
    expect(setDoc).toHaveBeenCalled();
  });
});
