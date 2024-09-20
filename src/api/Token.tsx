import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TokenContextProps {
  accessToken: string | null;
  refreshToken: string | null;
  setAccessToken: (token: string) => void;
  setRefreshToken: (token: string) => void;
}

const TokenContext = createContext<TokenContextProps | undefined>(undefined);

export const TokenProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('access_token'));
  const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem('refresh_token'));

  const updateAccessToken = (token: string) => {
    setAccessToken(token);
    localStorage.setItem('access_token', token);
  };

  const updateRefreshToken = (token: string) => {
    setRefreshToken(token);
    localStorage.setItem('refresh_token', token);
  };

  return (
    <TokenContext.Provider value={{ accessToken, refreshToken, setAccessToken: updateAccessToken, setRefreshToken: updateRefreshToken }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useToken = (): TokenContextProps => {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error('useToken must be used within a TokenProvider');
  }
  return context;
};
