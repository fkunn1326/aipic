import Image from "next/image"
import React, { useState } from "react"

function cn(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

export default function Preview({image}) {
    const [isLoading, setLoading] = useState(true);

    return (
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-600">
        <Image
          src={URL.createObjectURL(image)}
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
          }}
        />
      </div>
    )
}