import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import React, { useLayoutEffect, useState } from "react";

export default function FollowBtn({following_uid, followed_uid}) {
    const router = useRouter();
    const [isfollowed, setisfollowed] = useState(false)
    const [ischanged, setischanged] = useState(false)

    const handleComplete = url => {
        if (url !== router.pathname) {
            setisfollowed(false);
            setischanged(!ischanged)
        }
    };

    const handlefollow = async() => {
        if (isfollowed){
            const {data, error} = await supabaseClient
                .from("follows")
                .delete()
                .match({
                    "following_uid": following_uid,
                    "followed_uid": followed_uid
                })
            setisfollowed(false)
        }else{
            const {data, error} = await supabaseClient
                .from("follows")
                .insert({
                    "following_uid": following_uid,
                    "followed_uid": followed_uid
                })
            setisfollowed(true)
        }
    }

    useLayoutEffect(() => {
        (async() => {
            const {data, error} = await supabaseClient
                .from("follows")
                .select("*")
                .match({
                    "following_uid": following_uid,
                    "followed_uid": followed_uid
                })
            if (data !== null && data?.length !== 0){
                setisfollowed(true)
            }
        })()
        router.events.on("routeChangeComplete", handleComplete);
    }, [ischanged])


    return (
      <div>
        {following_uid !== undefined &&
            <button
                onClick={() => {handlefollow()}}
                className={`
                    w-full rounded-full font-semibold text-sm my-5 px-5 py-2 text-center 
                    ${isfollowed ? "text-gray-800 bg-gray-200": "text-white bg-sky-500"}
                `}
            >
                {isfollowed ? "フォロー解除する" : "フォローする"}
            </button>
        }
      </div>
    );
}