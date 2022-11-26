import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useContext } from "react";
import Header from "../../components/header/header";
import Footer from "../../components/footer";
import { Listbox, Tab, Transition } from "@headlessui/react";
import {
  CheckIcon,
  ChevronUpDownIcon,
  PlusIcon,
  XCircleIcon,
} from "@heroicons/react/20/solid";
import { getChunks } from "png-chunks";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";
import { userInfoContext } from "../../context/userInfoContext";
import { useRouter } from "next/router";
import { supabaseClient, withPageAuth } from "@supabase/auth-helpers-nextjs";
import ReactDOM from "react-dom";
import ReactTags from "react-tag-autocomplete";
import axios from "axios";
import useSWR from "swr";
import { parseCookies } from "nookies";
import { NextPageContext } from "next";
import Link from "next/link";
import InputForm from "../../components/form/InputForm";
import SelectMenu from "../../components/form/SelectMenu";
import TagsInput from "../../components/form/TagsInput";
import TextAreaForm from "../../components/form/TextAreaForm";
import { chunk_reader } from "../../utils/chunk_reader";
import {
  DndContext,
  closestCenter,
  useSensors,
  MouseSensor,
  TouchSensor,
  useSensor,
  DragEndEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import Preview from "../../components/form/Preview";

export const getServerSideProps = withPageAuth({ redirectTo: "/" });

type tags = {
  name: string;
  id: string;
  count: number;
};

const fetcher = (url) => fetch(url).then((r) => r.json());

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
  { id: 10, name: "niji · journey", unavailable: false },
  { id: 11, name: "Custom Model", unavailable: false },
];

const Edit = (props) => {
  const ctx = useContext(userInfoContext);
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [selectedindex, setselectedindex] = useState(0);
  const [isdropping, setisdropping] = useState(false);
  const [isSelected, setisSelected] = useState(true);
  const [isSending, setisSending] = useState(false);
  const [imageurl, setimageurl] = useState("");
  const [prompt, setprompt] = useState("");
  const [nprompt, setnprompt] = useState("");
  const [title, settitle] = useState("");
  const [caption, setcaption] = useState("");
  const [agelimit, setagelimit] = useState("");
  const [imagedata, setimagedata] = useState(null);
  const [tags, setTags] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<tags[]>([]);
  const [file, setfile] = useState<any>();
  const [isdeleting, setisdeleting] = useState<boolean>(false);
  const [ischanging, setischanging] = useState<boolean>(false);
  const [step, setstep] = useState<number>();
  const [sampler, setsampler] = useState("");
  const [images, setimages] = useState<any[]>([]);
  const [defaultimages, setdefaultimages] = useState<any[]>([])
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { distance: 5 } })
  );

  const reactTags = useRef();

  const inputEl = useRef<null | any>(null!);

  const onDelete = useCallback(
    (tagIndex) => {
      setTags(tags.filter((tag, index) => index !== tagIndex));
    },
    [tags]
  );

  const onAddition = useCallback(
    (newTag) => {
      var name = newTag.name.startsWith("#") ? newTag.name : `#${newTag.name}`;
      var localNewTag = {
        id: newTag.id,
        name: name,
      };
      setTags([...tags, localNewTag]);
    },
    [tags]
  );

  const onValidate = useCallback((newTag) => {
    var flag: boolean =
      tags.find((tag) => {
        return tag.name.slice(1) === newTag.name;
      }) === undefined;
    return flag;
  }, []);

  const onInput = async (query) => {
    if (query.length <= 2) {
      const result = await fetch(`/api/tags/suggest/?word=${query}`);
      setSuggestions(await result.json());
    }
  };

  const router = useRouter();
  const { id } = router.query;

  const { data, error } = useSWR(`../../api/artworks/${id}`, fetcher);

  const loadflag = useRef<boolean>(false);

  const [isloaded, setisloaded] = useState(false);

  useEffect(() => {
    if (!isloaded) {
      if (data) {
        try {
          if (ctx.UserInfo.id !== data[0].user_id) {
            router.push("/");
          }
          setimageurl(data[0].image_contents[0].href);
          settitle(data[0].title);
          setcaption(data[0].caption);
          setagelimit(data[0].age_limit)
          var localtag: tags[] = [];
          data[0].tags.map((i) => {
            localtag.push({
              id: `#${i}`,
              name: `#${i}`,
              count: 0,
            });
          });
          setTags(localtag);

          data[0].image_contents.map(async (img) => {
            let blob = await fetch(img.href).then((r) => r.blob());
            setimages((images) => [
              ...images,
              {
                prompt: img.prompt,
                nprompt: img.nprompt,
                steps: img.steps,
                sampler: img.sampler,
                selectedModel: models.find((model) => {
                  return model["name"] === img.model;
                }),
                image: blob,
                id: img.id,
              },
            ]);
            setdefaultimages((defaultimages) => [
              ...defaultimages,
              {
                prompt: img.prompt,
                nprompt: img.nprompt,
                steps: img.steps,
                sampler: img.sampler,
                selectedModel: models.find((model) => {
                  return model["name"] === img.model;
                }),
                image: blob,
                id: img.id,
              },
            ]);
          });
          setisloaded(true);
        } catch (e) {
          router.push("/");
        }
      }
    }
  }, [data, ctx]);

  const handleupload = async (e) => {
    var files = e.target.files;
    if (images.length + files.length > 30) {
      files = Array.prototype.slice.call(files, 0, 30 - images.length);
    }
    for (const file of files) {
      try {
        if (file.type === "image/png") {
          const buffer = await new Blob([file], {
            type: file.type,
          }).arrayBuffer();
          const chunk = chunk_reader(buffer);
          if (
            Object.values(chunk).every((v) => {
              return v !== "NaN";
            })
          ) {
            if (chunk.negative !== "NaN") setnprompt(chunk.negative);
            if (chunk.positive !== "NaN") setprompt(chunk.positive);
            if (chunk.sampler !== "NaN") setsampler(chunk.sampler);
            if (chunk.steps !== "NaN") setstep(chunk.steps);
            if (chunk.software === "NovelAI") setSelectedModel(models[2]);
            setimages((images) => [
              ...images,
              {
                prompt: chunk.positive !== "NaN" ? chunk.positive : "",
                nprompt: chunk.negative !== "NaN" ? chunk.negative : "",
                steps: chunk.steps !== "NaN" ? chunk.steps : "",
                sampler: chunk.sampler !== "NaN" ? chunk.sampler : "",
                selectedModel:
                  chunk.software === "NovelAI" ? models[2] : models[0],
                image: new Blob([file], { type: file.type }),
                id: uuidv4(),
              },
            ]);
          } else {
            setimages((images) => [
              ...images,
              {
                prompt: "",
                nprompt: "",
                steps: "",
                sampler: "",
                selectedModel: models[0],
                image: new Blob([file], { type: file.type }),
                id: uuidv4(),
              },
            ]);
          }
        } else {
          setimages((images) => [
            ...images,
            {
              prompt: "",
              nprompt: "",
              steps: "",
              sampler: "",
              selectedModel: models[0],
              image: new Blob([file], { type: file.type }),
              id: uuidv4(),
            },
          ]);
        }
      } catch (e) {}
    }
    try {
      var blob = e.target.files[0];
      setfile(new Blob([blob], { type: blob.type }));
      setisSelected(true);
      setimageurl(URL.createObjectURL(new Blob([blob], { type: "image/png" })));
    } catch (e) {}
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

    try {
      var tagsarr: string[] = [];
      tags.map((tag) => {
        tagsarr.push(tag["name"].slice(1));
      });

      setisSending(true);
      setischanging(true);

      if(images !== defaultimages) {
        defaultimages.map(async (image) => {
          await axios.post(
            "/api/r2/delete",
            JSON.stringify({
              token: `${supabaseClient?.auth?.session()?.access_token}`,
              image_id: `${image.id}`,
            }),
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          await supabaseClient.from("images").delete().eq("id", image.id)
        });
        images.map(async (image) => {
          const responseUploadURL = await axios.post("/api/r2/upload");
  
          const url = JSON.parse(JSON.stringify(responseUploadURL.data));
  
          var formdata = new FormData();
  
          formdata.append("file", image.image);
          formdata.append("id", `image-${image.id}`);
  
          await axios.post(url.uploadURL, formdata, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
  
          const { data, error } = await supabaseClient
            .from("images")
            .insert({
              id: image.id,
              href: `https://imagedelivery.net/oqP_jIfD1r6XgWjKoMC2Lg/image-${image.id}/public`,
              model: image.selectedModel.name,
              prompt: image.prompt,
              nprompt: image.nprompt,
              promptarr: image.prompt
                .split(/,|\(|\)|\{|\}|\[|\]|\!|\||\:/g)
                .map((i) => i.trim())
                .filter(function (i) {
                  return i !== "";
                }),
              npromptarr: image.nprompt
                .split(/,|\(|\)|\{|\}|\[|\]|\!|\||\:/g)
                .map((i) => i.trim())
                .filter(function (i) {
                  return i !== "";
                }),
              steps: image.steps,
              sampler: image.sampler,
              user_id: ctx.UserInfo["id"],
            })
        })
      }

      const imagesarr = images.map((image) => {
        return image.id;
      });

      await supabaseClient
        .from("artworks")
        .update({
          id: data[0].id,
          caption: caption,
          href: `https://imagedelivery.net/oqP_jIfD1r6XgWjKoMC2Lg/image-${imagesarr[0]}/public`,
          age_limit: agelimit,
          title: title,
          tags: tagsarr,
          user_id: ctx.UserInfo["id"],
          images: imagesarr,
        })
        .match({
          id: data[0].id,
        });

      router.push(`/artworks/${data[0].id}`);
    } catch (e) {
      alert("アップロード中にエラーが発生しました。再試行してください。");
      setisSending(false);
    }
  };

  const handledelete = async (e) => {
    const check = confirm(
      `一度消した画像は復元することはできません。\n本当に削除しますか？`
    );
    if (check) {
      setisSending(true);
      setisdeleting(true);

      defaultimages.map(async (image) => {
        await axios.post(
          "/api/r2/delete",
          JSON.stringify({
            token: `${supabaseClient?.auth?.session()?.access_token}`,
            image_id: `${image.id}`,
          }),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        await supabaseClient.from("images").delete().match({ id: image.id });
      });

      await supabaseClient
        .from("artworks")
        .delete()
        .match({ id: data[0].id });

      router.push("/");
    }
  };

  const handleDelete = (i) => {
    setTags(tags.filter((tag, index) => index !== i));
  };

  const handleAddition = (tag) => {
    if (tag["name"] !== undefined)
      if (!tag["name"].startsWith("#")) tag["name"] = "#" + tag["name"];
    setTags([...tags, tag]);
  };

  const handleDrag = (tag, currPos, newPos) => {
    const newTags = tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    setTags(newTags);
  };

  const handleTagClick = (index) => {
    handleDelete(index);
  };

  const handleInputChange = async (tag) => {
    if (tag !== "") {
      const result = await fetch(`/api/tags/suggest/?word=${tag}`);
      setSuggestions(await result.json());
    }
  };

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setimages((image) => {
      var index = image.indexOf(
        image.filter((image) => image.id === event.active?.id)[0]
      );
      setimageurl(
        URL.createObjectURL(
          new Blob([image[index]?.image], { type: "image/png" })
        )
      );
      URL.revokeObjectURL(imageurl);
      setselectedindex(index);
      return image;
    });
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setimages((image) => {
        const oldIndex = image.indexOf(
          image.filter((image) => image.id === active.id)[0]
        );
        const newIndex = image.indexOf(
          image.filter((image) => image.id === over?.id)[0]
        );
        setselectedindex(newIndex);
        return arrayMove(image, oldIndex, newIndex);
      });
    }
  }, []);

  return (
    <div className="relative bg-white dark:bg-slate-900 items-center">
      <Header></Header>
      <div className="mt-4 flex flex-col items-center justify-center lg:py-0">
        <div className="w-11/12 bg-white dark:bg-slate-900 md:mt-0 sm:max-w-2xl md:max-w-full xl:p-0">
          <div className="">
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={(e) => {
                handlesubmit(e);
              }}
            >
              <Tab.Group
                selectedIndex={selectedindex}
                onChange={(index) => {
                  setselectedindex(index);
                  setimageurl(
                    URL.createObjectURL(
                      new Blob([images[index].image], { type: "image/png" })
                    )
                  );
                  URL.revokeObjectURL(imageurl);
                }}
              >
                <div className="grid md:grid-cols-2 gap-x-8">
                  <div>
                    <div
                      className="flex justify-center items-center w-full"
                      onDragOver={(e) => handledrag(e)}
                      onDragLeave={(e) => handledrag(e)}
                      onDrop={(e) => handledrop(e)}
                    >
                      {!isSelected ? (
                        <label
                          className={`flex flex-col justify-center items-center w-full h-64 bg-gray-50 dark:bg-slate-800 dark:border-slate-600 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 ${
                            isdropping &&
                            "border-4 border-sky-500 bg-sky-100 dark:bg-slate-700"
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
                            ref={inputEl}
                            multiple
                            required
                          />
                        </label>
                      ) : (
                        <div className="flex flex-col justify-center items-center w-full h-96 bg-gray-50 dark:bg-slate-800 dark:border-slate-600  rounded-lg border-2 border-gray-300 border-dashed cursor-pointer relative">
                          <XCircleIcon
                            className="absolute z-10 text-sky-400 w-8 h-8 top-2 right-2 bg-gray-50 dark:bg-slate-800 dark:border-slate-600  rounded-full hover:text-sky-500"
                            onClick={() => {
                              setimages(
                                images.filter(
                                  (config, index) => index !== selectedindex
                                )
                              );
                              const localimages = images.filter(
                                (image, index) => index !== selectedindex
                              );
                              setimages(localimages);
                              if (localimages.length !== 0) {
                                setimageurl(
                                  URL.createObjectURL(
                                    new Blob([localimages[0].image], {
                                      type: "image/png",
                                    })
                                  )
                                );
                                URL.revokeObjectURL(imageurl);
                                setselectedindex(0);
                              } else {
                                setisSelected(false);
                              }
                            }}
                          ></XCircleIcon>
                          <Image
                            src={imageurl}
                            layout="fill"
                            objectFit="scale-down"
                            className="z-0 select-none"
                          ></Image>
                        </div>
                      )}
                    </div>
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                      onDragStart={handleDragStart}
                    >
                      <Tab.List
                        as="div"
                        className="m-4 grid grid-cols-3 sm:grid-cols-5 gap-4"
                      >
                        <SortableContext
                          items={images}
                          strategy={rectSortingStrategy}
                        >
                          {images.map(function (image, idx) {
                            var deleteimage = (e) => {
                              e.preventDefault();
                              const localimages = images.filter(
                                (config, index) => index !== idx
                              );
                              setimages(localimages);
                              if (localimages.length !== 0) {
                                setimageurl(
                                  URL.createObjectURL(
                                    new Blob([localimages[0].image], {
                                      type: "image/png",
                                    })
                                  )
                                );
                                URL.revokeObjectURL(imageurl);
                                setselectedindex(0);
                              } else {
                                setisSelected(false);
                              }
                            };
                            return (
                              <Tab as={Fragment} key={image?.id}>
                                <div className={`rounded-lg cursor-pointer`}>
                                  <Preview
                                    image={image?.image}
                                    id={image?.id}
                                    selected={idx === selectedindex}
                                    deleteimage={deleteimage}
                                  />
                                </div>
                              </Tab>
                            );
                          })}
                        </SortableContext>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/png, image/jpeg, image/webp"
                          multiple
                          onChange={(e) => {
                            handleupload(e);
                          }}
                          id="hiddeninput"
                        />
                        {isSelected && (
                          <button
                            type="button"
                            className="bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center "
                            onClick={() => {
                              document.getElementById("hiddeninput")?.click();
                            }}
                          >
                            <PlusIcon className="w-full h-full p-4 text-gray-500 dark:text-slate-900" />
                          </button>
                        )}
                      </Tab.List>
                    </DndContext>
                  </div>
                  <Tab.Panels as="div" className="pt-4">
                    <div className="max-w-2xl p-6 space-y-4 md:space-y-6 sm:h-[80vh] pb-64 overflow-scroll rounded bg-gray-50 border dark:border-none dark:bg-slate-800">
                      <p className="dark:text-white font-semibold">
                        作品の情報
                      </p>
                      <InputForm
                        caption={"タイトル"}
                        state={title}
                        setState={settitle}
                        required
                      />
                      <TextAreaForm
                        caption={"説明"}
                        state={caption}
                        setState={setcaption}
                        required
                      />
                      <TagsInput
                        caption={"タグ"}
                        state={tags}
                        setState={setTags}
                      />
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
                                  onChange={() => {}}
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
                                  onChange={() => {}}
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
                                  onChange={() => {}}
                                  checked={agelimit === "r18g"}
                                  required
                                ></input>
                                R18-G
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                      {images.map(function (image, i) {
                        var setlocalprompt = (prompt) => {
                          var localobj = Object.assign(images[i]);
                          localobj["prompt"] = prompt;
                          setimages(
                            images.map((config, index) =>
                              index === i ? localobj : config
                            )
                          );
                        };
                        var setlocalnprompt = (nprompt) => {
                          var localobj = Object.assign(images[i]);
                          localobj["nprompt"] = nprompt;
                          setimages(
                            images.map((config, index) =>
                              index === i ? localobj : config
                            )
                          );
                        };
                        var setlocalsteps = (steps) => {
                          var localobj = Object.assign(images[i]);
                          localobj["steps"] = steps;
                          setimages(
                            images.map((config, index) =>
                              index === i ? localobj : config
                            )
                          );
                        };
                        var setlocalsampler = (sampler) => {
                          var localobj = Object.assign(images[i]);
                          localobj["sampler"] = sampler;
                          setimages(
                            images.map((config, index) =>
                              index === i ? localobj : config
                            )
                          );
                        };
                        var setlocalselectedModel = (selectedModel) => {
                          var localobj = Object.assign(images[i]);
                          localobj["selectedModel"] = selectedModel;
                          setimages(
                            images.map((config, index) =>
                              index === i ? localobj : config
                            )
                          );
                        };

                        var batchprompt = (prompt) => {
                          setimages(
                            images.map((config, index) => {
                              var localobj = Object.assign(config);
                              localobj["prompt"] = prompt;
                              return localobj;
                            })
                          );
                        };
                        var batchnprompt = (nprompt) => {
                          setimages(
                            images.map((config, index) => {
                              var localobj = Object.assign(config);
                              localobj["nprompt"] = nprompt;
                              return localobj;
                            })
                          );
                        };
                        var batchsteps = (steps) => {
                          setimages(
                            images.map((config, index) => {
                              var localobj = Object.assign(config);
                              localobj["steps"] = steps;
                              return localobj;
                            })
                          );
                        };
                        var batchsampler = (sampler) => {
                          setimages(
                            images.map((config, index) => {
                              var localobj = Object.assign(config);
                              localobj["sampler"] = sampler;
                              return localobj;
                            })
                          );
                        };
                        var batchmodel = (model) => {
                          setimages(
                            images.map((config, index) => {
                              var localobj = Object.assign(config);
                              localobj["selectedModel"] = model;
                              return localobj;
                            })
                          );
                        };
                        return (
                          <Tab.Panel className="space-y-4" key={i}>
                            <p className="dark:text-white font-semibold">
                              画像ごとの情報（{i + 1} / {images.length}）
                            </p>
                            <TextAreaForm
                              caption={"プロンプト"}
                              state={images[i]?.prompt}
                              setState={setlocalprompt}
                              batch={batchprompt}
                            />
                            <TextAreaForm
                              caption={"ネガティブプロンプト"}
                              state={images[i]?.nprompt}
                              setState={setlocalnprompt}
                              batch={batchnprompt}
                            />
                            <InputForm
                              caption={"ステップ数"}
                              state={images[i]?.steps}
                              setState={setlocalsteps}
                              batch={batchsteps}
                            />
                            <InputForm
                              caption={"サンプラー"}
                              state={images[i]?.sampler}
                              setState={setlocalsampler}
                              batch={batchsampler}
                            />
                            <SelectMenu
                              caption={"使用したモデル"}
                              state={images[i]?.selectedModel}
                              setState={setlocalselectedModel}
                              object={models}
                              batch={batchmodel}
                            />
                          </Tab.Panel>
                        );
                      })}
                      {inputEl?.current?.files?.length === 0 && (
                        <>
                          <TextAreaForm
                            caption={"プロンプト"}
                            state={prompt}
                            setState={setprompt}
                          />
                          <TextAreaForm
                            caption={"ネガティブプロンプト"}
                            state={nprompt}
                            setState={setnprompt}
                          />
                          <InputForm
                            caption={"ステップ数"}
                            state={step}
                            setState={setstep}
                          />
                          <InputForm
                            caption={"サンプラー"}
                            state={sampler}
                            setState={setsampler}
                          />
                          <SelectMenu
                            caption={"使用したモデル"}
                            state={selectedModel}
                            setState={setSelectedModel}
                            object={models}
                          />
                        </>
                      )}
                    </div>
                    <p className="my-4 dark:text-slate-300">
                      <Link href="/terms/tos">
                        <a className="text-sky-600 dark:text-sky-500">
                          利用規約
                        </a>
                      </Link>
                      や
                      <Link href="/terms/guideline">
                        <a className="text-sky-600 dark:text-sky-500">
                          ガイドライン
                        </a>
                      </Link>
                      に違反する作品は削除の対象となります。
                    </p>
                    <button
                      type="submit"
                      className={`my-4 flex flex-row justify-center w-full text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
                        !isSending
                          ? "bg-sky-500 hover:bg-sky-600 focus:ring-4 focus:outline-none focus:ring-sky-300"
                          : "bg-sky-300"
                      }`}
                      disabled={isSending}
                    >
                      {isSending && (
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      )}
                      保存する
                    </button>
                    <button
                      type="button"
                      className={`flex flex-row justify-center w-full text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
                        !isSending
                          ? "bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300"
                          : "bg-red-300"
                      }`}
                      onClick={(e) => {
                        handledelete(e);
                      }}
                      disabled={isSending}
                    >
                      {isdeleting && (
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      )}
                      削除する
                    </button>
                  </Tab.Panels>
                </div>
              </Tab.Group>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Edit;
