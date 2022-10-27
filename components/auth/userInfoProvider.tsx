import { useUser } from "@supabase/auth-helpers-react";
import {
  userInfoContext,
  useUserInfoContext,
} from "../../context/userInfoContext";
import React, { useEffect } from "react";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";

const UserInfoProvider = ({ children }) => {
  const ctx = useUserInfoContext();
  const { user, error } = useUser();
  useEffect(() => {
    let unmounted = false;
    var data = user === null ? false : user;
    (async () => {
      if (user !== null) {
        var udata = await supabaseClient
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()
          .then((response) => {
            ctx.SetuserInfo(response.body);
          });
      } else {
        ctx.SetuserInfo(false);
      }
    })();
  }, [user]);
  return (
    <userInfoContext.Provider value={ctx}>{children}</userInfoContext.Provider>
  );
};

export default UserInfoProvider;
