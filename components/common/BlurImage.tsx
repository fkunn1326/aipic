import Link from "next/link";
import Image from "next/image"
import React, { useState } from "react";


function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function BlurImage({ image }) {
    const [isLoading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState<boolean>(false);
  
    return (
      <div className="group" onClick={() => setIsOpen(true)}>
        <div className="relative">
          <div className="cursor-pointer aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
            <Link href={`/images/${image.id}`}>
              <a>
                <Image
                  alt={image.title}
                  src={image.href}
                  layout="fill"
                  objectFit="cover"
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
            <p className="absolute bottom-2 right-4 text-sm font-semibold bg-red-500 text-white px-2 rounded-md">
              NSFW
            </p>
          )}
          {image.age_limit === "r18" && (
            <p className="absolute bottom-2 right-4 text-sm font-semibold bg-red-500 text-white px-2 rounded-md">
              R-18
            </p>
          )}
          {image.age_limit === "r18g" && (
            <p className="absolute bottom-2 right-4 text-sm font-semibold bg-red-500 text-white px-2 rounded-md">
              R-18G
            </p>
          )}
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