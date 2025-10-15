import React, { createContext, useState, useContext } from 'react';
interface ScrollContextType {
  isTabVisible: boolean;
  setIsTabVisible: (visible: boolean) => void;
}

const ScrollContext = createContext<ScrollContextType>({
  isTabVisible: true,
  setIsTabVisible: () => {},
});

export const ScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTabVisible, setIsTabVisible] = useState(true);
  return (
    <ScrollContext.Provider value={{ isTabVisible, setIsTabVisible }}>
      {children}
    </ScrollContext.Provider>
  );
};

export const useScroll = () => useContext(ScrollContext);
