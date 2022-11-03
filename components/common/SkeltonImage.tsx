import React from "react";

export default function SkeletonImage() {
    return (
      <div className="group">
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 animate-pulse"></div>
        <div className="mt-2 rounded-full bg-gray-200 h-3 w-32"></div>
        <div className="mt-1 w-full flex items-center">
          <div className="h-5 w-5 rounded-full bg-gray-200"></div>
          <div className="ml-2 rounded-full bg-gray-200 h-3 w-16"></div>
        </div>
      </div>
    );
  }