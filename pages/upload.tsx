import React, { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { useContext } from "react";
import Header from "../components/header/header";
import Footer from "../components/footer";
import { Listbox, Transition } from "@headlessui/react";
import {
  CheckIcon,
  ChevronUpDownIcon,
  XCircleIcon,
} from "@heroicons/react/20/solid";
import { getChunks } from "png-chunks";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";
import { userInfoContext } from "../context/userInfoContext";
import { useRouter } from "next/router";
import { supabaseClient, withPageAuth } from "@supabase/auth-helpers-nextjs";
import InputForm from "../components/form/InputForm";
import TextAreaForm from "../components/form/TextAreaForm";
import TagsInput from "../components/form/TagsInput";
import SelectMenu from "../components/form/SelectMenu";
import Preview from "../components/form/Preview"
import { chunk_reader } from "../utils/chunk_reader"
import axios from "axios";
import Link from "next/link";

export const getServerSideProps = withPageAuth({ redirectTo: "/" });

const models = [
  { id: 1, name: "Stable Diffusion", unavailable: false },
  { id: 2, name: "Waifu Diffusion", unavailable: false },
  { id: 3, name: "NovelAI", unavailable: false },
  { id: 4, name: "TrinArt", unavailable: false },
  { id: 5, name: "Midjourney", unavailable: false },
  { id: 6, name: "DALL·E 2", unavailable: false },
  { id: 7, name: "ERNIE-ViLG", unavailable: false },
  { id: 8, name: "Unstable Diffusion", unavailable: false },
  { id: 9, name: "Hentai Diffusion", unavailable: false },
  { id: 10, name: "Custom Model", unavailable: false },
];

const Upload = (props) => {
  const ctx = useContext(userInfoContext);
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [isdropping, setisdropping] = useState(false);
  const [isSelected, setisSelected] = useState(false);
  const [isSending, setisSending] = useState(false);
  const [imageurl, setimageurl] = useState("");
  const [prompt, setprompt] = useState("");
  const [nprompt, setnprompt] = useState("");
  const [title, settitle] = useState("");
  const [caption, setcaption] = useState("");
  const [agelimit, setagelimit] = useState("all");
  const [tags, setTags] = useState<any[]>([]);
  const [step, setstep] = useState<number>()
  const [sampler, setsampler] = useState("")
  const [file, setfile] = useState<any>()
  const [images, setimages] = useState<any[]>([])
  const [selectedimage, setselectedimage] = useState("")

  const router = useRouter();

  const query = router.query;
  useEffect(() => {
      if(router.isReady) {
          if(query.tag !== undefined){
            var localNewTag = {
              "id": query.tag,
              "name": `#${query.tag}`
            }
            setTags([...tags, localNewTag])
          }
      };
  },[query, router]);


  const handleupload = async (e) => {
    var blob = e.target.files[0];
    setfile(new Blob([blob], {"type": blob.type}))
    for (const file of e.target.files){
      setimages((images) => ([ ...images, new Blob([blob], {"type": blob.type}) ]));
      if (file.type === "image/png"){
        const buffer = await new Blob([file], {"type": file.type}).arrayBuffer()
        const chunk = chunk_reader(buffer)
        if (Object.values(chunk).every((v) => {return v !== "NaN"})) {
          if(chunk.negative !== "NaN") setnprompt(chunk.negative)
          if(chunk.positive !== "NaN") setprompt(chunk.positive)
          if(chunk.sampler !== "NaN") setsampler(chunk.sampler)
          if(chunk.steps !== "NaN") setstep(chunk.steps)
          if(chunk.software === "NovelAI") setSelectedModel(models[2])
        }
      }
    }
    setisSelected(true);
    setimageurl(
      URL.createObjectURL(new Blob([blob], { type: "image/png" }))
    );
  };

  const handledrag = (e) => {
    e.type === "dragleave" ? setisdropping(false) : setisdropping(true);
    e.preventDefault();
    e.stopPropagation();
  };

  const handledrop = (e) => {
    e.preventDefault();
    var fileInput = document.getElementById("uploadaria") as HTMLInputElement;
    if (fileInput === null) return;
    fileInput.files = e.dataTransfer.files;
    let event = new Event("change", { bubbles: true });
    fileInput.dispatchEvent(event);
    setisdropping(false);
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    var tagsarr: string[] = []
    tags.map(tag=>{
      tagsarr.push(tag["name"].slice(1))
    })
    setisSending(true);
    var uuid = uuidv4();
    var formdata = new FormData()

    formdata.append("file", file)
    formdata.append("id",`image-${uuid}`)

    try{
      const responseUploadURL = await axios.post(
        "/api/r2/upload",
      );
      
      const url = JSON.parse(JSON.stringify(responseUploadURL.data))

      await axios.post(
        url.uploadURL,
        formdata, 
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      const { data, error } = await supabaseClient.from("images").insert({
        id: uuid,
        prompt: prompt,
        nprompt: nprompt,
        promptarr: prompt.split(/,|\(|\)|\{|\}|\[|\]|\!|\||\:/g).map(i => i.trim()).filter(function(i){return i !== "";}),
        npromptarr: nprompt.split(/,|\(|\)|\{|\}|\[|\]|\!|\||\:/g).map(i => i.trim()).filter(function(i){return i !== "";}),
        caption: caption,
        model: selectedModel.name,
        href: `https://imagedelivery.net/oqP_jIfD1r6XgWjKoMC2Lg/image-${uuid}/public`,
        age_limit: agelimit,
        title: title,
        sampler: sampler,
        steps: step,
        tags: tagsarr,
        user_id: ctx.UserInfo["id"],
      });
      router.push("/");
    }catch(e){
      alert("アップロード中にエラーが発生しました。再試行してください。")
      setisSending(false);
    }
  };

  const handlePromptChange = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
    setprompt(e.target.value);
  };

  const handlenPromptChange = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
    setnprompt(e.target.value);
  };

  const handleCaptionChange = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
    setcaption(e.target.value);
  };
  
  return (
    <div className="relative bg-white dark:bg-slate-900 items-center">
      <Header></Header>
      <div className="mt-4 mb-60 flex flex-col items-center justify-center lg:py-0">
        <div className="w-11/12 bg-white dark:bg-slate-900 md:mt-0 max-w-[22rem] sm:max-w-2xl xl:p-0">
          <div className="">
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={(e) => {
                handlesubmit(e);
              }}
            >
              <div
                className="flex justify-center items-center w-full"
                onDragOver={(e) => handledrag(e)}
                onDragLeave={(e) => handledrag(e)}
                onDrop={(e) => handledrop(e)}
              >
                {!isSelected ? (
                  <label
                    className={`flex flex-col justify-center items-center w-full h-64 bg-gray-50 dark:bg-slate-800 dark:border-slate-600 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 ${
                      isdropping && "border-4 border-sky-500 bg-sky-100 dark:bg-slate-700"
                    }`}
                  >
                    <div className="flex flex-col justify-center items-center pt-5 pb-6">
                      <svg
                        aria-hidden="true"
                        className="mb-3 w-10 h-10 text-gray-400 dark:text-slate-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        ></path>
                      </svg>
                      <p className="mb-2 text-sm text-gray-500 dark:text-slate-300">
                        ファイルを選択
                      </p>
                      <p className="text-xs text-gray-500 dark:text-slate-300 text-center">
                        PNG,JPG
                        <br />
                        1枚4MB以内
                        <br />
                        アップロードできます。
                      </p>
                    </div>
                    <input
                      id="uploadaria"
                      type="file"
                      className="hidden"
                      accept="image/png, image/jpeg, image/webp"
                      onChange={(e) => handleupload(e)}
                      multiple
                      required
                    />
                  </label>
                ) : (
                  <div className="flex flex-col justify-center items-center w-full h-96 bg-gray-50 dark:bg-slate-800 dark:border-slate-600  rounded-lg border-2 border-gray-300 border-dashed cursor-pointer relative">
                    <XCircleIcon
                      className="absolute z-10 text-sky-400 w-8 h-8 top-2 right-2 bg-gray-50 dark:bg-slate-800 dark:border-slate-600  rounded-full hover:text-sky-500"
                      onClick={() => {
                        setisSelected(false);
                      }}
                    ></XCircleIcon>
                    <Image
                      src={imageurl}
                      layout="fill"
                      objectFit="scale-down"
                      className="z-0"
                    ></Image>
                  </div>
                )}
              </div>
              {/* <div className="grid grid-cols-6 gap-4">
              {images.map(function (image, i) {
                return (
                  <div className="group" key={i}>
                    <Preview image={image} />
                  </div>
                );
              })}
              </div> */}
              <InputForm caption={"タイトル"} state={title} setState={settitle} required/>
              <TextAreaForm caption={"説明"} state={caption} setState={setcaption} required/>
              <TextAreaForm caption={"プロンプト"} state={prompt} setState={setprompt}/>
              <TextAreaForm caption={"ネガティブプロンプト"} state={nprompt} setState={setnprompt} />
              <InputForm caption={"ステップ数"} state={step} setState={setstep} />
              <InputForm caption={"サンプラー"} state={sampler} setState={setsampler} />
              <TagsInput caption={"タグ"} state={tags} setState={setTags}  />
              <SelectMenu caption={"使用したモデル"} state={selectedModel} setState={setSelectedModel} object={models} />
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  年齢制限
                </label>
                <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 sm:flex  dark:border-slate-600 dark:bg-slate-800 dark:text-white">
                  <li className="bg-gray-50 w-full border-b rounded-l-lg dark:border-slate-600 dark:bg-slate-800 dark:text-white border-gray-200 sm:border-b-0 sm:border-r">
                    <div className="pl-3">
                      <label className="flex items-center py-3 w-full text-sm font-medium text-gray-900cursor-pointer dark:border-slate-600 dark:bg-slate-800 dark:text-white">
                        <input
                          id="horizontal-list-radio-license"
                          type="radio"
                          className="outline-none rounded mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                          name="bordered-radio"
                          onClick={() => {
                            setagelimit("all");
                          }}
                          onChange={() => {;}}
                          checked={agelimit === "all"}
                          required
                        ></input>
                        全年齢
                      </label>
                    </div>
                  </li>
                  <li className="bg-gray-50 w-full border-b dark:border-slate-600 dark:bg-slate-800 dark:text-white border-gray-200 sm:border-b-0 sm:border-r">
                    <div className="pl-3">
                      <label className="flex items-center py-3 w-full text-sm font-medium text-gray-900 dark:text-white cursor-pointer">
                        <input
                          id="horizontal-list-radio-id"
                          type="radio"
                          className="outline-none mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                          name="bordered-radio"
                          onClick={() => {
                            setagelimit("r18");
                          }}
                          onChange={() => {;}}
                          checked={agelimit === "r18"}
                          required
                        ></input>
                        R18
                      </label>
                    </div>
                  </li>
                  <li className="bg-gray-50 w-full border-b rounded-r-lg  dark:border-slate-600 dark:bg-slate-800 dark:text-white border-gray-200 sm:border-b-0 sm:border-r">
                    <div className="pl-3">
                      <label className="flex items-center py-3 w-full text-sm font-medium text-gray-900 dark:text-white cursor-pointer">
                        <input
                          id="horizontal-list-radio-millitary"
                          type="radio"
                          className="outline-none mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                          name="bordered-radio"
                          onClick={() => {
                            setagelimit("r18g");
                          }}
                          onChange={() => {;}}
                          checked={agelimit === "r18g"}
                          required
                        ></input>
                        R18-G
                      </label>
                    </div>
                  </li>
                </ul>
              </div>

              <p className="my-4 dark:text-slate-300">
                <Link href="/terms/tos">
                  <a className="text-sky-600 dark:text-sky-500">利用規約</a>
                </Link>
                や
                <Link href="/terms/guideline">
                  <a className="text-sky-600 dark:text-sky-500">ガイドライン</a>
                </Link>
                に違反する作品は削除の対象となります。
              </p>
              <button
                type="submit"
                className={`flex flex-row justify-center w-full text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
                  !isSending
                    ? "bg-sky-500 hover:bg-sky-600 focus:ring-4 focus:outline-none focus:ring-sky-300"
                    : "bg-sky-300"
                }`}
                disabled={isSending}
              >
                {isSending &&
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                }
                投稿する
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Upload;