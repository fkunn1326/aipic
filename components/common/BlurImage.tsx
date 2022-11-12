import Link from "next/link";
import Image from "next/image"
import React, { useContext, useLayoutEffect, useState } from "react";
import {
  HeartIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { userInfoContext } from "../../context/userInfoContext";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";


function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function BlurImage({ image }) {
    const ctx = useContext(userInfoContext);

    const [isLoading, setLoading] = useState(true);
    const [isliked, setisliked] = useState(false);

    const handlelike = async (e) => {
      if (ctx.UserInfo.id !== undefined) {
        if (isliked) {
          await supabaseClient.from("likes").delete().match({
            image_id: image.id,
            user_id: ctx.UserInfo.id,
          });
          setisliked(false);
        } else {
          await supabaseClient.from("likes").insert({
            image_id: image.id,
            user_id: ctx.UserInfo.id,
          });
          setisliked(true);
        }
      }
    };

    useLayoutEffect(() => {
      if (image !== undefined) {
        image.likes.map((like) => {
          if (like.user_id === ctx.UserInfo.id) setisliked(true);
        });
      }
    }, [image, ctx]);
  
    return (
      <div className="group">
        <div className="relative">
          <div className="cursor-pointer aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
            <Link href={`/images/${image.id}`}>
              <a>
                <Image
                  alt={image.title}
                  src={image.href}
                  layout="fill"
                  objectFit="cover"
                  priority={true}
                  sizes="(max-width: 768px) 50vw,
                  (max-width: 1200px) 30vw,
                  20vw"
                  className={cn(
                    "duration-700 ease-in-out group-hover:opacity-75",
                    isLoading
                      ? "scale-110 blur-2xl grayscale"
                      : "scale-100 blur-0 grayscale-0"
                    // image.age_limit !== 'all'
                    //   ? 'blur-md'
                    //   : ''
                  )}
                  onLoadingComplete={() => {
                    setLoading(false);
                  }}
                />
              </a>
            </Link>
          </div>
          {image.age_limit === "nsfw" && (
            <p className="absolute top-2 left-2 text-sm font-semibold bg-red-500 text-white px-2 rounded-md">
              NSFW
            </p>
          )}
          {image.age_limit === "r18" && (
            <p className="absolute top-2 left-2 text-sm font-semibold bg-red-500 text-white px-2 rounded-md">
              R-18
            </p>
          )}
          {image.age_limit === "r18g" && (
            <p className="absolute top-2 left-2 text-sm font-semibold bg-red-500 text-white px-2 rounded-md">
              R-18G
            </p>
          )}
            <button className="absolute bottom-1 right-1 text-sm font-semibold px-2 rounded-md" onClick={(e) => handlelike(e)}>
              {isliked ? (
                <HeartSolidIcon className="w-8 h-8 text-pink-500"></HeartSolidIcon>
              ) : (
                <HeartIcon className="w-8 h-8 fill-white"></HeartIcon>
              )}
            </button>
        </div>
        <p className="mt-2 text-base font-semibold text-gray-900 text-ellipsis whitespace-nowrap overflow-hidden">
          {image.title}
        </p>
        <Link href={`/users/${image.author.uid}`}>
          <a className="mt-1 w-full flex items-center">
            <Image
              src={image.author.avatar_url}
              width={20}
              height={20}
              className="rounded-full"
            ></Image>
            <h3 className="ml-2 text-base text-gray-700">{image.author.name}</h3>
          </a>
        </Link>
      </div>
    );
  }