import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useContext } from "react";
import Header from "../components/header/header";
import Footer from "../components/footer";
import {
  PlusIcon,
  XCircleIcon,
} from "@heroicons/react/20/solid";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";
import { userInfoContext } from "../context/userInfoContext";
import { useRouter } from "next/router";
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { supabaseClient } from "../utils/supabaseClient";
import InputForm from "../components/form/InputForm";
import TextAreaForm from "../components/form/TextAreaForm";
import TagsInput from "../components/form/TagsInput";
import SelectMenu from "../components/form/SelectMenu";
import Preview from "../components/form/Preview";
import { chunk_reader } from "../utils/chunk_reader";
import axios from "axios";
import Link from "next/link";
import { Tab } from "@headlessui/react";
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { useTranslation, Trans } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export const getServerSideProps = async ({ req, res, locale}) => {
  const supabase = createServerSupabaseClient({ req, res })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session)
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }

  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common'
      ])),
    },
  }
}

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

const Upload = (...props) => {
  const { t } = useTranslation('common')
  const ctx = useContext(userInfoContext);
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [selectedindex, setselectedindex] = useState(0);
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
  const [step, setstep] = useState<number>();
  const [sampler, setsampler] = useState("");
  const [file, setfile] = useState<any>();
  const [images, setimages] = useState<any[]>([]);
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { distance: 5 } })
  );

  const router = useRouter();
  const inputEl = useRef<null | any>(null!);

  const query = router.query;
  useEffect(() => {
    if (router.isReady) {
      if (query.tag !== undefined) {
        var localNewTag = {
          id: query.tag,
          name: `#${query.tag}`,
        };
        setTags([...tags, localNewTag]);
      }
    }
  }, [query, router]);

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

    setisSending(true);
    
    try {
      var tagsarr: string[] = [];
      tags.map((tag) => {
        tagsarr.push(tag["name"].slice(1));
      });

      images.map(async (image) => {
        const responseUploadURL = await axios.post(`/api/r2/upload`);

        const url = JSON.parse(JSON.stringify(responseUploadURL.data));

        var formdata = new FormData();

        formdata.append("file", image.image);
        formdata.append("id", `image-${image.id}`);

        await axios.post(url.uploadURL, formdata, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const { data, error } = await supabaseClient.from("images").insert({
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
        });
      });

      var uuid = uuidv4();

      const imagesarr = images.map((image) => {
        return image.id;
      });

      const { data, error } = await supabaseClient.from("artworks").insert({
        id: uuid,
        caption: caption,
        href: `https://imagedelivery.net/oqP_jIfD1r6XgWjKoMC2Lg/image-${imagesarr[0]}/public`,
        age_limit: agelimit,
        title: title,
        tags: tagsarr,
        user_id: ctx.UserInfo["id"],
        images: imagesarr,
      });

      router.push("/");
    } catch (e) {
      alert(t('UploadPage.UploadError', "アップロード中にエラーが発生しました。再試行してください。"));
      setisSending(false);
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
                          className={`flex flex-col justify-center items-center w-full md:h-96 h-48 dark:bg-slate-800 dark:border-slate-600 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer hover:bg-sky-50 dark:hover:bg-slate-700 ${
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
                              {t('UploadPage.SelectFile' ,"ファイルを選択")}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-slate-300 text-center">
                              PNG,JPG,GIF
                              <br />
                              {t('UploadPage.Note1','1枚50MB以内')}
                              <br />
                              {t('UploadPage.Note2','アップロードできます。')}
                            </p>
                          </div>
                          <input
                            id="uploadaria"
                            type="file"
                            className="hidden"
                            accept="image/png, image/jpeg, image/webp, image/gif"
                            onChange={(e) => handleupload(e)}
                            ref={inputEl}
                            multiple
                            required
                          />
                        </label>
                      ) : (
                        <div className="flex flex-col justify-center items-center w-full md:h-96 h-48 dark:bg-slate-800 dark:border-slate-600  rounded-lg border-2 border-gray-300 border-dashed cursor-pointer relative">
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
                            className="border-2 dark:bg-slate-700 rounded-lg flex items-center justify-center "
                            onClick={() => {
                              document.getElementById("hiddeninput")?.click();
                            }}
                          >
                            <PlusIcon className="w-full h-full p-5 text-gray-500 dark:text-slate-900" />
                          </button>
                        )}
                      </Tab.List>
                    </DndContext>
                  </div>
                  <Tab.Panels as="div" className="pt-4">
                    <div className="max-w-2xl md:p-8 p-2 space-y-4 md:space-y-6 sm:h-[100vh] md:pb-64 overflow-scroll rounded md:shadow md:border dark:border-none dark:bg-slate-800">
                      <p className="dark:text-white font-semibold">
                        {t('UploadPage.ArtworkInfo','作品の情報')}
                      </p>
                      <InputForm
                        caption={t("UploadPage.Title", "タイトル")}
                        state={title}
                        setState={settitle}
                        required
                      />
                      <TextAreaForm
                        caption={t('UploadPage.Caption',"説明")}
                        state={caption}
                        setState={setcaption}
                        required
                      />
                      <TagsInput
                        caption={t('UploadPage.Tag',"タグ")}
                        state={tags}
                        setState={setTags}
                      />
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                          {t('UploadPage.AgeLimit','年齢制限')}
                        </label>
                        <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 sm:flex  dark:border-slate-600 dark:bg-slate-800 dark:text-white">
                          <li className="w-full border-b rounded-l-lg dark:border-slate-600 dark:bg-slate-800 dark:text-white border-gray-200 sm:border-b-0 sm:border-r">
                            <div className="pl-3">
                              <label className="flex items-center py-3 w-full text-sm font-medium text-gray-900cursor-pointer dark:border-slate-600 dark:bg-slate-800 dark:text-white">
                                <input
                                  id="horizontal-list-radio-license"
                                  type="radio"
                                  className="mr-1.5 appearance-none	rounded-full h-4 w-4 border-4 border-gray-300 bg-white checked:bg-white checked:border-sky-500 focus:outline-none transition duration-200 cursor-pointer shadow"
                                  name="bordered-radio"
                                  onClick={() => {
                                    setagelimit("all");
                                  }}
                                  onChange={() => {}}
                                  checked={agelimit === "all"}
                                  required
                                ></input>
                                {t('UploadPage.AllAges','全年齢')}
                              </label>
                            </div>
                          </li>
                          <li className="w-full border-b dark:border-slate-600 dark:bg-slate-800 dark:text-white border-gray-200 sm:border-b-0 sm:border-r">
                            <div className="pl-3">
                              <label className="flex items-center py-3 w-full text-sm font-medium text-gray-900 dark:text-white cursor-pointer">
                                <input
                                  id="horizontal-list-radio-id"
                                  type="radio"
                                  className="mr-1.5 appearance-none	rounded-full h-4 w-4 border-4 border-gray-300 bg-white checked:bg-white checked:border-sky-500 focus:outline-none transition duration-200 cursor-pointer shadow"
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
                          <li className="w-full border-b rounded-r-lg  dark:border-slate-600 dark:bg-slate-800 dark:text-white border-gray-200 sm:border-b-0 sm:border-r">
                            <div className="pl-3">
                              <label className="flex items-center py-3 w-full text-sm font-medium text-gray-900 dark:text-white cursor-pointer">
                                <input
                                  id="horizontal-list-radio-millitary"
                                  type="radio"
                                  className="mr-1.5 appearance-none	rounded-full h-4 w-4 border-4 border-gray-300 bg-white checked:bg-white checked:border-sky-500 focus:outline-none transition duration-200 cursor-pointer shadow"
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
                              {t('UploadPage.ImageInfo','画像ごとの情報')}（{i + 1} / {images.length}）
                            </p>
                            <TextAreaForm
                              caption={t('UploadPage.Prompt',"プロンプト")}
                              state={images[i]?.prompt}
                              setState={setlocalprompt}
                              batch={batchprompt}
                            />
                            <TextAreaForm
                              caption={t('UploadPage.NPrompt',"ネガティブプロンプト")}
                              state={images[i]?.nprompt}
                              setState={setlocalnprompt}
                              batch={batchnprompt}
                            />
                            <InputForm
                              caption={t('UploadPage.Steps',"ステップ数")}
                              state={images[i]?.steps}
                              setState={setlocalsteps}
                              batch={batchsteps}
                            />
                            <InputForm
                              caption={t('UploadPage.Sampler',"サンプラー")}
                              state={images[i]?.sampler}
                              setState={setlocalsampler}
                              batch={batchsampler}
                            />
                            <SelectMenu
                              caption={t('UploadPage.SelectedModel',"使用したモデル")}
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
                            caption={t('UploadPage.Prompt',"プロンプト")}
                            state={prompt}
                            setState={setprompt}
                          />
                          <TextAreaForm
                            caption={t('UploadPage.NPrompt',"ネガティブプロンプト")}
                            state={nprompt}
                            setState={setnprompt}
                          />
                          <InputForm
                            caption={t('UploadPage.Steps',"ステップ数")}
                            state={step}
                            setState={setstep}
                          />
                          <InputForm
                            caption={t('UploadPage.Sampler',"サンプラー")}
                            state={sampler}
                            setState={setsampler}
                          />
                          <SelectMenu
                            caption={t('UploadPage.SelectedModel',"使用したモデル")}
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
                          {t('UploadPage.Tos','利用規約')}
                        </a>
                      </Link>
                      {t('UploadPage.And','や')}
                      <Link href="/terms/guideline">
                        <a className="text-sky-600 dark:text-sky-500">
                          {t('UploadPage.GuideLine','ガイドライン')}
                        </a>
                      </Link>
                      {t('UploadPage.aaaa','に違反する作品は削除の対象となります。')}
                    </p>
                    <button
                      type="submit"
                      className={`flex flex-row justify-center w-full text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center shadow ${
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
                      {t('UploadPage.Post','投稿する')}
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

export default Upload;
