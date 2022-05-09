import { render, screen } from '@testing-library/react';
import Message from '../Message';

const props = {
  msg: {
    from: 'uidMock123',
    text: 'Hello, we are testing',
    createdAt: { toDate: jest.fn() },
  },
  currentUser: 'uidMock123',
};

const renderComponent = () => render(<Message {...props} />);

window.HTMLElement.prototype.scrollIntoView = jest.fn();

describe('Message', () => {
  it('Render <Message /> and check that message is provide from me', () => {
    renderComponent();
    const message = screen.getByText(/Hello, we are testing/i);

    expect(message).toBeTruthy();
    expect(message.classList).toContain('me');
    expect(message.classList).not.toContain('friend');
  });

  it('Render <Message /> and check that message is provide from someone', () => {
    props.currentUser = 'uidMock333';
    renderComponent();
    const message = screen.getByText(/Hello, we are testing/i);

    expect(message).toBeTruthy();
    expect(message.classList).toContain('friend');
    expect(message.classList).not.toContain('me');
  });
});
