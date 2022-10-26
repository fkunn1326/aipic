import Image from 'next/image'
import { useState, useEffect, useContext  } from 'react'
import React from 'react'
import Header from '../components/header/header'
import { supabaseClient } from '@supabase/auth-helpers-nextjs'
import useSWR from 'swr';
import Link from 'next/link'

export async function getStaticProps() {
  const { data } = await supabaseClient.from('images').select('*').order('created_at')
  return {
    props: {
      images: data,
    },
  }
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

type Image = {
  id: number
  created_at: string
  user_id: string
  prompt: string
  href: string
  title: string
}

const fetcher = url => fetch(url).then(r => r.json())

export default function App() {
  const { data, error } = useSWR('../api/images/list', fetcher);
  if (!data) return (
    <div>
      <Header></Header>
      <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-8">
          {Array.apply(0, Array(10)).map(function (x, i) {
            return <SkeletonImage key={i} />;
          })}
        </div>
      </div>
    </div>
  )
  var images = data.slice(0, data.length);
  return (
    <div>
      <Header></Header>
      <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-8">
          {images.reverse().map((image) => (
            <BlurImage key={image.id} image={image}/>
          ))}
        </div>
      </div>
    </div>
  )
}

function BlurImage({ image }: { image: Image }) {
  const [isLoading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [userData, SetuserData] = useState<any>([{}]);

  useEffect(() => {
    (async() => {
      const { data } = await supabaseClient.from('profiles').select('*').eq('id', image.user_id)
      SetuserData(data);
    })();
  }, []);

  return (
    <div className="group" onClick={() => setIsOpen(true)}>
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
        <Link href={`/images/${image.id}`}>
          <Image
            alt={image.title}
            src={image.href}
            layout="fill"
            objectFit="cover"
            className={cn(
              'duration-700 ease-in-out group-hover:opacity-75',
              isLoading
                ? 'scale-110 blur-2xl grayscale'
                : 'scale-100 blur-0 grayscale-0'
            )}
            onLoadingComplete={() => setLoading(false)}
          />
        </Link>
      </div>
      <p className="mt-2 text-base font-semibold text-gray-900">{image.title}</p>
      <div className="mt-1 w-full flex items-center">
        <img src={userData[0]["avatar_url"]} className="h-5 w-5 rounded-full"></img>
        <h3 className="ml-2 text-base text-gray-700">{userData[0]["name"]}</h3>
      </div>
    </div>
  )
}

function SkeletonImage() {
  return (
    <div className="group">
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 animate-pulse">
      </div>
      <div className="mt-2 rounded-full bg-gray-200 h-3 w-32"></div>
      <div className="mt-1 w-full flex items-center">
        <div className="h-5 w-5 rounded-full bg-gray-200"></div>
        <div className="ml-2 rounded-full bg-gray-200 h-3 w-16"></div>
      </div>
    </div>
  )
}