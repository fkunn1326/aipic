import { createContext, useCallback, useState } from "react";

export const userInfoContext = createContext<any>(null);

export const useUserInfoContext = (): any => {
  const [UserInfo, setUsetData] = useState(null);
  const SetuserInfo = useCallback((current: any): void => {
    setUsetData(current);
  }, []);
  return {
    UserInfo,
    SetuserInfo,
  };
};
