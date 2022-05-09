import { createContext, useState, useContext } from 'react';

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const [chat, dispatchChat] = useState(null);

  return <ChatContext.Provider value={{ chat, dispatchChat }}>{children}</ChatContext.Provider>;
};

export const useChatContext = () => {
  const context = useContext(ChatContext);

  if (!context) {
    throw Error('useChatContext must be used inside an ChatContextProvider');
  }

  return context;
};
