import { createContext, useCallback, useState } from 'react';

export const userInfoContext = createContext<any>(false);

export const useUserInfoContext = (): any => {
  const [UserInfo, setUsetData] = useState(false);
  const SetuserInfo = useCallback((current: any): void => {
    setUsetData(current);
  }, []);
  return {
    UserInfo,
    SetuserInfo,
  };
};
