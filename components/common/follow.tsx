import { supabaseClient } from "../../utils/supabaseClient";
import { useRouter } from "next/router";
import React, { useEffect, useLayoutEffect, useState } from "react";
<<<<<<< HEAD
import { t } from "../../utils/Translation"

export default function FollowBtn({ following_uid, followed_uid }, ...props) {
=======

export default function FollowBtn({ following_uid, followed_uid }) {
>>>>>>> parent of d4a7aab (Add: CloudFlare Pages対応)
  const router = useRouter();
  const [isfollowed, setisfollowed] = useState(false);
  const [ischanged, setischanged] = useState(false);

  const handleComplete = (url) => {
    if (url !== router.pathname) {
      setisfollowed(false);
      setischanged(!ischanged);
    }
  };

  const handlefollow = async () => {
    if (isfollowed) {
      const { data, error } = await supabaseClient
        .from("follows")
        .delete()
        .match({
          following_uid: following_uid,
          followed_uid: followed_uid,
        });
      setisfollowed(false);
    } else {
      const { data, error } = await supabaseClient.from("follows").insert({
        following_uid: following_uid,
        followed_uid: followed_uid,
      });
      setisfollowed(true);
    }
  };

  useEffect(() => {
    if (following_uid !== undefined){
      (async () => {
        const { data, error } = await supabaseClient
          .from("follows")
          .select("*")
          .match({
            following_uid: following_uid,
            followed_uid: followed_uid,
          });
        if (data !== null && data?.length !== 0) {
          setisfollowed(true);
        }
      })();
    }
    router.events.on("routeChangeComplete", handleComplete);
  }, [ischanged, following_uid]);

  return (
    <div>
      {following_uid !== undefined && (
        <button
          onClick={() => {
            handlefollow();
          }}
          className={`
                    w-full rounded-full font-semibold text-sm my-5 px-5 py-2 text-center transition-colors duration-100	ease-linear	
                    ${
                      isfollowed
                        ? "text-gray-800 bg-gray-200"
                        : "text-white bg-sky-500"
                    }
                `}
        >
          {isfollowed ? "フォロー解除する" : "フォローする"}
        </button>
      )}
    </div>
  );
}
