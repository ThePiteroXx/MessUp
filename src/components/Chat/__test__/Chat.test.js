import { render, screen } from '@testing-library/react';
import Chat from '../Chat';

jest.mock('firebase/firestore', () => ({
  ...jest.requireActual('firebase/firestore'),
  onSnapshot: (q, callback) =>
    callback([
      {
        data: jest.fn(() => ({
          from: 'uidMock123',
          text: 'Hello',
          createdAt: { toDate: jest.fn() },
        })),
        id: 'messID',
      },
    ]),
}));
jest.mock('hooks/useChatContext', () => ({
  useChatContext: () => ({
    dispatchChat: jest.fn(),
  }),
}));

jest.mock('hooks/useCollection', () => ({
  useCollection: () => ({
    documents: [
      {
        displayName: 'mockUser',
        isOnline: true,
        photoURL: 'mockUrl',
      },
    ],
  }),
}));

window.HTMLElement.prototype.scrollIntoView = jest.fn();

describe('Chat', () => {
    it('Render <Chat />', () => {
    render(<Chat chat={{ user: 'uidUser', idChat: 'idCHat' }} currentUserUid="21" />);
    screen.debug();
  });
});
