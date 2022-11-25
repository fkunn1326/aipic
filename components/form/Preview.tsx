import Image from "next/image"
import React, { useState } from "react"
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  XMarkIcon
} from "@heroicons/react/20/solid";

function cn(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

export default function Preview({image, id, deleteimage, selected=false}) {
    const [isLoading, setLoading] = useState(true);
    const [imageurl, setimageurl] = useState(URL.createObjectURL(image))
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <div className={`relative aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg select-none bg-gray-200 dark:bg-gray-600 ${selected ? 'outline outline-sky-500 outline-[5px] z-10' : ''}`}  ref={setNodeRef} style={style} {...attributes} {...listeners} >
        <XMarkIcon className="absolute top-2 left-2 w-6 h-6 z-10 p-1 bg-slate-200 rounded-lg" onClick={(e) => {deleteimage(e)}} />
        <Image
          src={imageurl}
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
          )}
          onLoadingComplete={() => {
            setLoading(false);
            URL.revokeObjectURL(imageurl)
          }}
        />
      </div>
    )
}