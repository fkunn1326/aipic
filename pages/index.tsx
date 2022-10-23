import Image from 'next/image'
import { useState, useEffect, useContext  } from 'react'
import React from 'react'
import Modal from '../components/modal'
import Header from '../components/header/header'
import { supabaseClient } from '@supabase/auth-helpers-nextjs'

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


export default function App({ images }: { images: Image[] }) {
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
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="overscroll-contain flex w-full h-full self-stretch flex-col md:flex-row pb-16 md:pb-0  md:pt-0 flex-1">
            <div className="w-full flex-shrink-0 overflow-hidden text-base px-5 flex flex-col h-auto" style={{ height: 'fit-content', width: '400px' }}>
              <div className="my-6 px-5 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl shadow bg-opacity-50 flex flex-col space-y-5" style={{ order: 0 }}>
                <p>{image.prompt}</p>
                <div className="flex space-x-2 text-xs">
                  <div className="flex flex-col">
                    <div className="text-bold rounded-md sm:text-xs active:scale-95 transition-all transform-gpu whitespace-nowrap flex-1 flex select-none cursor-pointer bg-sky-500 items-center justify-center shadow px-2.5 py-2 w-fit-content text-white" onClick={() => navigator.clipboard.writeText(image.prompt)}>
                      プロンプトをコピー
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full md:h-full flex flex-col relative">
              <Image
                alt={image.title}
                src={image.href}
                layout="fill"
                objectFit="scale-down"
              />
            </div>
        </div>
      </Modal>
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
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
      </div>
      <p className="mt-2 text-base font-semibold text-gray-900">{image.title}</p>
      <div className="mt-1 w-full flex items-center">
        <img src={userData[0]["avatar_url"]} className="h-5 w-5 rounded-full"></img>
        <h3 className="ml-2 text-base text-gray-700">{userData[0]["name"]}</h3>
      </div>
    </div>
  )
}