import { useRouter } from 'next/router';
import Header from '../../components/header/header'
import React, { useContext, useEffect, useState } from 'react';
import useSWR from 'swr';
import Image from 'next/image'
import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { HeartIcon, ArrowUpOnSquareIcon, EllipsisHorizontalIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import ImageModal from '../../components/modal/imagemodel'
import Modal from '../../components/modal/modal';
import ShareModal from '../../components/modal/sharemodal'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faFacebook, faLine } from "@fortawesome/free-brands-svg-icons";
import { userInfoContext } from '../../context/userInfoContext';
import Link from 'next/link';

const fetcher = url => fetch(url).then(r => r.json())

const copyToClipboard = (text) =>{
  const pre = document.createElement('pre');
  pre.style.webkitUserSelect = 'auto';
  pre.style.userSelect = 'auto';
  pre.textContent = text;
  document.body.appendChild(pre);
  document.getSelection()!.selectAllChildren(pre);
  const result = document.execCommand('copy');
  document.body.removeChild(pre);
  return result;
}

const Images = () => {  
  const ctx = useContext(userInfoContext);

  const [isImageOpen, setisImageOpen] = useState(false)
  const [isPromptOpen, setisPromptOpen] = useState(false)
  const [isShareOpen, setisShareOpen] = useState(false)

  const [isliked, setisliked] = useState(false)
  const [limittype, setlimittype] = useState("")

  const router = useRouter();
  const pid = router.query.id;
  const { data, error } = useSWR(`../../api/images/${pid}`, fetcher);

  const handlelike = async (e) => {
    if (ctx.UserInfo.id !== undefined){
      if (isliked) {
        await supabaseClient
          .from('likes')
          .delete()
          .match({
            image_id: image.id,
            user_id: ctx.UserInfo.id 
          })
        setisliked(false)
      }else{
        await supabaseClient
          .from('likes')
          .insert({
            image_id: image.id,
            user_id: ctx.UserInfo.id 
          })
        setisliked(true)
      }
    }
  }


  useEffect(() => {
    if (data !== undefined) {
      image.likes.map((like) => {
        if (like.user_id === ctx.UserInfo.id) setisliked(true)
      })
      console.log(ctx.UserInfo.id)
      if (ctx.UserInfo.id === undefined){
        setlimittype("unauth")
      }else{
        if (!ctx.UserInfo.access_limit[image.age_limit]){
          setlimittype("unsafe")
        }else{
          setlimittype("ok")
        }
      }
      if (image.age_limit === "all") setlimittype("ok")
    }
  },[data]);

  if (!data) return <div>Loading...</div>
  var image = data[0]
  if (!image) return <div>Loading...</div>



  return (
    <div>
      <Header/>
      <div className="px-12 grow w-full max-w-full min-h-0 min-w-0 shrink-0 flex-col basis-auto flex items-stretch">
        <div className="glow mx-4 my-auto px-0 lg:mx-9 lg:my-auto lg:py-4 md:mx-6 mb:my-auto mb:py-7 sm:py-6">
          <div className="flex-nowrap flex-col">
            <main className="pt-16 mb-16 flex-row flex-nowrap items-start flex basis-auto">
              <div className="mr-8 flex-col flex w-full basis-3/4 border rounded-3xl">
                <div className="h-[120vh] w-full">
                  <div className="flex mb-8 relative h-[70vh] items-center w-full">
                    <div className="flex flex-col absolute inset-0 items-center justify-center">
                      <div className="flex relative flex-col-reverse z-auto h-full w-full">
                        <div className={`relative h-full w-full box-content rounded-t-3xl ${limittype !== "ok" && "bg-neutral-400"}`}>
                          {limittype !== "unauth" &&
                            <Image
                              alt={image.title}
                              src={image.href}
                              layout="fill"
                              objectFit="contain"
                              className={`rounded-lg w-full h-full min-h-[70vh] z-10 ${limittype === "ok" && "cursor-zoom-in"} ${limittype === "unsafe" && "blur-xl opacity-60 pointer-events-none"}`}
                              onClick={() => {
                                if (limittype === "ok") setisImageOpen(true)
                              }}
                            />
                          }
                          <ImageModal isOpen={isImageOpen} onClose={() => setisImageOpen(false)}>
                            <div className="relative w-full h-full">
                              <Image
                                src={image.href}
                                layout="fill"
                                objectFit="contain"
                                className="rounded-lg w-full h-full min-h-[70vh]"
                                onClick={() => {
                                  setisImageOpen(false)
                                }}
                              />
                            </div>
                          </ImageModal>
                          {limittype === "unsafe" &&
                            <div className="flex flex-col gap-8 justify-center items-center absolute inset-0 m-auto z-50 pointer-events-auto">
                              <p className="text-xl text-white font-semibold">{image.age_limit.toUpperCase()}作品は、非表示に設定されています。</p>
                              <Link href="/settings">
                                <a className="text-base text-white font-semibold py-4 px-12 border rounded-3xl cursor-pointer">
                                    設定を変更する
                                </a>
                              </Link>
                            </div>
                          }
                          {limittype === "unauth" &&
                            <div className="flex flex-col gap-8 justify-center items-center absolute inset-0 m-auto z-50 pointer-events-auto">
                              <p className="text-xl text-white font-semibold">{image.age_limit.toUpperCase()}作品を表示するには、ログインする必要があります。</p>
                              <Link href="/signin">
                                <a className="text-base text-white font-semibold py-4 px-12 border rounded-3xl cursor-pointer">
                                    サインイン
                                </a>
                              </Link>
                            </div>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row justify-end flex-nowrap mt-6 w-full">
                    <div className="flex flex-end flex-row flex-nowrap p-6 gap-4">
                      <button className= "h-8 mr-2" onClick={() => setisPromptOpen(true)}>
                        プロンプトを表示する
                      </button>
                      <Modal isOpen={isPromptOpen} onClose={() => setisPromptOpen(false)}>
                        <div className="bg-slate-50 p-8 rounded-3xl">
                          <p className="text-gray-600 text-sm">使用モデル</p>
                          <p className="mt-2 font-semibold text-2xl">{image.model}</p>
                        </div>
                        <div className="bg-slate-50 p-8 rounded-3xl mt-4">
                          <div className="flex justify-between">
                            <p className="text-gray-600 text-sm">プロンプト</p>
                            <button className="border rounded-lg hover:bg-gray-100 active:bg-gray-200 active:border-green-600">
                              <ClipboardDocumentIcon className="w-5 h-5 text-gray-600 m-2" onClick={() => {copyToClipboard(image.prompt)}}/>
                            </button>
                          </div>
                          <p className="font-semibold">{image.prompt}</p>
                        </div>
                      </Modal>
                      <button className="w-8 h-8" onClick={(e) => handlelike(e)}>
                        {isliked ?
                          <HeartSolidIcon className="w-8 h-8 text-pink-500"></HeartSolidIcon>       
                        :
                          <HeartIcon className="w-8 h-8"></HeartIcon>
                        }
                      </button>
                      <button className="w-8 h-8" onClick={() => setisShareOpen(true)}>
                        <ArrowUpOnSquareIcon className="w-8 h-8"></ArrowUpOnSquareIcon>
                      </button>
                      <ShareModal isOpen={isShareOpen} onClose={() => setisShareOpen(false)}>
                        <div className="p-5 rounded-3xl">
                          <p className="text-gray-600 text-sm">この作品を共有</p>
                        </div>
                        <div className="grid grid-cols-4 gap-4 px-6">
                          <div className="flex flex-col items-center text-sm text-gray-700">
                            <a 
                              className="group w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 mb-1"
                              href={`https://twitter.com/intent/tweet?text=${image.title}\n&url=${location.href}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FontAwesomeIcon icon={faTwitter} className="w-7 h-7 group-hover:text-sky-500"/>
                            </a>
                            Twitter
                          </div>
                          <div className="flex flex-col items-center text-sm text-gray-700">
                            <a 
                              className="group w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 mb-1"
                              href={`http://www.facebook.com/share.php?u=${location.href}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FontAwesomeIcon icon={faFacebook} className="w-7 h-7 group-hover:text-blue-600"/>
                            </a>
                            Facebook
                          </div>
                          <div className="flex flex-col items-center text-sm text-gray-700">
                            <a 
                              className="group w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 mb-1"
                              href={`https://social-plugins.line.me/lineit/share?url=${location.href}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            > 
                              <FontAwesomeIcon icon={faLine} className="w-7 h-7 group-hover:text-green-500"/>
                            </a>
                            LINE
                          </div>
                          <div className="flex flex-col items-center text-sm text-gray-700">
                            <button 
                              className="group w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 mb-1"
                              onClick={async() => {
                                try{
                                  await navigator.share({ title: image.title, url: location.href });
                                }catch(e){
                                  console.error(e)
                                }
                              }}
                            >
                              <EllipsisHorizontalIcon className="w-7 h-7"/>
                            </button>
                            その他
                          </div>
                        </div>
                        <div className="m-6 h-14 rounded-2xl bg-slate-50 flex items-center whitespace-nowrap overflow-x-scroll">
                          <p className="mx-4">{location.href}</p>
                        </div>
                      </ShareModal>              
                      <button className="w-8 h-8">
                        <EllipsisHorizontalIcon className="w-8 h-8"></EllipsisHorizontalIcon>
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <div className="flex flex-col w-[40vw]">
                      <h1 className="text-2xl font-bold mt-3">
                        {image.title}
                      </h1>
                      <p className="mt-2 break-all">
                        {image.caption}
                      </p>  
                    </div>
                  </div>
                </div>
              </div>
              <div className="t-[96px] w-full basis-1/4">
                <div className="flex shrink basis-full sticky min-w-[370px] max-h-[450px]">
                  <div className="flex flex-col flex-nowrap">
                    <div className="mb-8 px-0 py-7">
                      <div className="mb-4 flex-col flex-nowrap">
                        <div className="flex mb-8 flex-col flex-nowrap">
                          <span className="mb-2">
                            <div className="flex flex-row flex-nowrap items-center">
                              <img src={image.author.avatar_url} className="h-9 w-9 rounded-full"></img>
                              <p className="ml-2 font-semibold">{image.author.name}</p>
                            </div>
                          </span>        
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Images;