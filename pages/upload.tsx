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
import ReactDOM from 'react-dom'
import ReactTags from 'react-tag-autocomplete'
import axios from "axios";
import Link from "next/link";

export const getServerSideProps = withPageAuth({ redirectTo: "/" });

type tags = {
  name: string,
  id: string,
  count: number
};

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
  const [href, sethref] = useState("");
  const [title, settitle] = useState("");
  const [caption, setcaption] = useState("");
  const [composing, setComposition] = useState(false);
  const [agelimit, setagelimit] = useState("all");
  const [imagedata, setimagedata] = useState(null);
  const [tags, setTags] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<tags[]>([]);
  const [file, setfile] = useState<any>()

  const router = useRouter();
  const reactTags = useRef()

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

  const onDelete = useCallback((tagIndex) => {
    setTags(tags.filter((tag, index) => index !== tagIndex));
  }, [tags])

  const onAddition = useCallback((newTag) => {
    var name = newTag.name.startsWith("#") ? newTag.name : `#${newTag.name}`
    var localNewTag = {
      "id": newTag.id,
      "name": name
    }
    setTags([...tags, localNewTag])
  }, [tags])

  const onValidate = useCallback((newTag) => {
    var flag: boolean = tags.find(tag => {return tag.name.slice(1) === newTag.name}) === undefined
    return flag
  }, [])

  const onInput = async query => {
    if (query !== ""){
      const result = await fetch(`/api/tags/suggest/?word=${query}`)
      setSuggestions(await result.json())
    }
  };

  const handleupload = (e) => {
    var file = e.target.files[0];
    setimagedata(file);
    if (file !== undefined) {
      var fileReader = new FileReader();
      fileReader.onload = async function webViewerChangeFileReaderOnload(evt) {
        var buffer = evt!.target!.result as ArrayBuffer;
        setfile(new Blob([buffer], {type: file.type}))
        var prompt = "";
        var negativeprompt = "";
        var metadata = {};
        try {
          var chunks = getChunks(new Uint8Array(buffer));
          for (var i = 0; i < chunks.length; i++) {
            if (chunks[i]["chunkType"] == "tEXt") {
              var chunk = new TextDecoder().decode(chunks[i]["data"]);
              if (chunk.startsWith("parameters")) {
                //Stable Diffusion Web UIのメタデータのみ
                prompt = chunk;
              } else if (chunk.startsWith("Description")) {
                //Novel AIのメタデータ（positive）
                prompt = chunk.substring(12);
              } else if (chunk.startsWith("Comment")) {
                //Novel AIのメタデータ（いろいろ）
                var obj = JSON.parse(chunk.substring(8));
                negativeprompt = obj["uc"];
                metadata = {
                  Steps: obj["steps"],
                  Sampler: obj["sampler"],
                  Strength: obj["strength"],
                  Noise: obj["noise"],
                  Scale: obj["scale"],
                  Seed: obj["seed"],
                };
              } else if (chunk.startsWith("Software")) {
                if (chunk.substring(9) === "NovelAI") {
                  setSelectedModel(models[2]);
                }
              }
            }else if (chunks[i]["chunkType"] == "iTXt"){
              var chunk = new TextDecoder('utf-8').decode(chunks[i]["data"]);
            }
          }
          var input_prompt = document.getElementById(
            "prompt"
          ) as HTMLInputElement;
          var input_nprompt = document.getElementById(
            "nprompt"
          ) as HTMLInputElement;
          if (prompt === "" && negativeprompt === "") {
            setprompt(prompt);
            input_prompt.value = prompt;
            let event = new Event("change", { bubbles: true });
            input_prompt.dispatchEvent(event);
            handlePromptChange(event);
          } else {
            if (negativeprompt === "") {
              //sd
              setprompt(prompt);
              const index_of_negative = prompt.indexOf("Negative prompt:");
              const index_of_steps = prompt.indexOf("Steps:");

              negativeprompt = prompt.substring(index_of_negative + "Negative prompt ".length, index_of_steps - 1);
              prompt = prompt.substring("parameters ".length, index_of_negative - 1);

              input_prompt.value = prompt;
              input_nprompt.value = negativeprompt;

              let event = new Event("change", { bubbles: true });
              let eventn = new Event("change", { bubbles: true });
              
              input_prompt.dispatchEvent(event);
              input_nprompt.dispatchEvent(eventn);

              handlePromptChange(event);
              handlenPromptChange(eventn);
            } else {
              //NAI
              setprompt(prompt);
              setnprompt(negativeprompt)
              input_prompt.value = prompt;
              input_nprompt.value = negativeprompt;

              let event = new Event("change", { bubbles: true });
              let eventn = new Event("change", { bubbles: true });

              input_prompt.dispatchEvent(event);
              input_nprompt.dispatchEvent(eventn);

              handlePromptChange(event);
              handlenPromptChange(eventn);
            }
          }
        } catch (e) {
          var blob = new Blob([file], { type: file.type });
          setfile(blob)
          var bitmap = await createImageBitmap(blob);
          var canvas = document.createElement("canvas");
          canvas.width = bitmap.width;
          canvas.height = bitmap.height;
          canvas.getContext("2d")?.drawImage(bitmap, 0, 0);
          canvas.toBlob((blob) => {
            setimageurl(URL.createObjectURL(blob as Blob));
          });
        }
        setisSelected(true);
        setimageurl(
          URL.createObjectURL(new Blob([buffer], { type: "image/png" }))
        );
      };
      fileReader.readAsArrayBuffer(file);
    }
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
    formdata.append("name", uuid)
    formdata.append("type", file.type)
    formdata.append("file", file)
    try{
      await axios.post(
        "/api/r2/upload",
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
        href: `https://pub-25066e52684e449b90f5170d93e6c396.r2.dev/images/${uuid}.png`,
        age_limit: agelimit,
        title: title,
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

  const handleDelete = i => {
    setTags(tags.filter((tag, index) => index !== i));
  };

  const handleAddition = tag => {
    if (tag["name"]!==undefined) if (!tag["name"].startsWith("#")) tag["name"] = "#" + tag["name"]
    setTags([...tags, tag]);
  };

  const handleDrag = (tag, currPos, newPos) => {
    const newTags = tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    setTags(newTags);
  };

  const handleTagClick = index => {
    handleDelete(index)
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
                        1枚50MB以内
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
              <div>
                <div className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  タイトル
                </div>
                <input
                  className="bg-gray-50 border border-gray-300 text-gray-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5"
                  required
                  onChange={(e) => settitle(e.target.value)}
                  value={title}
                  spellCheck="false"
                ></input>
              </div>
              <div>
                <div className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  説明
                </div>
                <textarea
                  className="bg-gray-50 border border-gray-300 text-gray-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block h-24 w-full p-2.5 resize-none"
                  onChange={(e) => {
                    handleCaptionChange(e);
                  }}
                  value={caption}
                  spellCheck="false"
                ></textarea>
              </div>
              <div>
                <div className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  タグ
                </div>
                <ReactTags
                  allowNew
                  ref={reactTags}
                  tags={tags}
                  suggestions={suggestions}
                  onDelete={onDelete}
                  onAddition={onAddition}
                  onValidate={onValidate}
                  onInput={onInput}
                  minQueryLength={1}
                  addOnBlur={true}
                  placeholderText={"タグを追加"}
                  classNames={{
                    root: 'relative p-2.5 border border-gray-300 cursor-text bg-gray-50 dark:border-slate-600 dark:bg-slate-800 dark:text-white border border-gray-300 rounded-lg',
                    rootFocused: '',
                    selected: 'inline',
                    selectedTag: 'inline-block box-border text-base text-sky-600 mr-2 !cursor-pointer hover:line-through',
                    search: 'inline-block',
                    searchInput: 'max-w-full outline-none bg-gray-50 dark:bg-slate-800',
                    suggestions: 'react-tags__suggestions dark:react-tags__suggestions_dark',
                    suggestionActive: 'is-active',
                    suggestionDisabled: 'is-disabled',
                  }} 
                />             
              </div>
              <div>
                <div className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  プロンプト（単語ごとにコンマで区切るようにしてください）
                </div>
                <textarea
                  className="bg-gray-50 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white text-gray-900 sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block h-32 w-full p-2.5 resize-none"
                  id="prompt"
                  onChange={(e) => {
                    handlePromptChange(e);
                  }}
                  required
                  value={prompt}
                  spellCheck="false"
                ></textarea>
              </div>
              <div>
                <div className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  ネガティブプロンプト（単語ごとにコンマで区切るようにしてください）
                </div>
                <textarea
                  className="bg-gray-50 border border-gray-300 text-gray-900  dark:border-slate-600 dark:bg-slate-800 dark:text-white sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block h-32 w-full p-2.5 resize-none"
                  id="nprompt"
                  onChange={(e) => {
                    handlenPromptChange(e);
                  }}
                  value={nprompt}
                  spellCheck="false"
                ></textarea>
              </div>
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
              <div className="w-full h-full">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  使用しているモデル名
                </label>
                <Listbox value={selectedModel} onChange={setSelectedModel}>
                  <div className="relative mt-1">
                    <Listbox.Button className="outline-none relative w-full cursor-default rounded-lg bg-gray-50 py-2 pl-3 pr-10 text-left border border-gray-300  dark:border-slate-600 dark:bg-slate-800 dark:text-white">
                      <span className="block truncate">
                        {selectedModel.name}
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </span>
                    </Listbox.Button>
                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm  dark:border-slate-600 dark:bg-slate-800">
                        {models.map((model, modelIdx) => (
                          <Listbox.Option
                            key={modelIdx}
                            className={({ active }) =>
                              `relative cursor-default select-none py-2 pl-10 pr-4 text-gray-900 ${
                                active ? "bg-sky-100 dark:bg-slate-700" : ""
                              }`
                            }
                            value={model}
                          >
                            {({ selected }) => (
                              <>
                                <span
                                  className={`block truncate dark:text-white ${
                                    selected ? "font-medium " : "font-normal"
                                  }`}
                                >
                                  {model.name}
                                </span>
                                {selected ? (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sky-600">
                                    <CheckIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
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
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
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