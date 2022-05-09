import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Friend from '../Friend';

const MockFriend = (props) => {
  return (
    <BrowserRouter>
      <Friend {...props} />
    </BrowserRouter>
  );
};

const dispatchChat = jest.fn();
let mockState = 'empty';
let mockDocs = null;

jest.mock('hooks/useCollection', () => ({
  useCollection: () => ({
    currentState: mockState,
    documents: mockDocs,
  }),
}));

const renderComponent = () => render(<MockFriend friendUid="1" currentUserUid="2" dispatchChat={dispatchChat} />);

describe('Friend', () => {
  describe('is loaded', () => {
    beforeAll(() => {
      mockState = 'loaded';
      mockDocs = [
        {
          displayName: 'Peter',
          photoURL: 'mockUrl',
          isOnline: true,
        },
      ];
    });

    it('Renders the <Friend />', () => {
      renderComponent();
      const friendWrapper = screen.getByTestId('friend');
      expect(friendWrapper).toBeTruthy();
    });

    it('Click on the <Friend /> and expect to dispatchChat have been called one time', () => {
      renderComponent();
      const friendWrapper = screen.getByTestId('friend');
      fireEvent.click(friendWrapper);

      expect(dispatchChat).toHaveBeenCalledTimes(1);
      expect(window.location.pathname).toEqual('/');
    });
  });

  describe('is loading', () => {
    beforeAll(() => {
      mockState = 'loading';
      mockDocs = null;
    });

    it('Renders the <Friend />', () => {
      renderComponent();
      const friendSkeletonWrapper = screen.getByTestId('friend-skeleton');
      expect(friendSkeletonWrapper).toBeTruthy();
    });
  });
});
