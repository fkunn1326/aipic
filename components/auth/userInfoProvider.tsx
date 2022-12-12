import {
  userInfoContext,
  useUserInfoContext,
} from "../../context/userInfoContext";
import React, { useEffect } from "react";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((r) => r.json());

const UserInfoProvider = ({ children, account }) => {
  const ctx = useUserInfoContext();
  const { data, error } = useSWR(
    `/api/auth/account`,
    fetcher,
    {
      fallbackData: account,
    }
  );

  useEffect(() => {
    if (!data) {
      ctx.SetuserInfo(null)
    }else{
      (async () => {
        if (data.error) {
          ctx.SetuserInfo(false);
        }else{
          ctx.SetuserInfo(data);
        }
      })();
    }
  }, [data]);
  return (
    <userInfoContext.Provider value={ctx}>{children}</userInfoContext.Provider>
  );
};

export default UserInfoProvider;
