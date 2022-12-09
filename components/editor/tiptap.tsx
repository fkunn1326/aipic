import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React, { Fragment } from 'react'
import CodeBlockLowlight from './highlight/index'
import Focus from '@tiptap/extension-focus'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import { lowlight } from 'lowlight'
import 'tippy.js/animations/shift-away-subtle.css';
import { FaBold, FaItalic, FaStrikethrough, FaUnderline, FaQuoteLeft, FaCode, FaLink, FaImage, FaRulerVertical, FaGripHorizontal, FaRulerHorizontal } from "react-icons/fa"
import { HiPlus } from "react-icons/hi2";
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import router from 'next/router'
import { Icon } from '@iconify/react';

const cn = (str: string) => {
    return str.split("\n").join(" ")
}

const Tiptap = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Focus.configure({
        className: 'relative overflow-visible before:absolute before:top-0 before:left-[-20px] before:w-1 before:h-full before:bg-slate-200',
        mode: 'shallowest',
      }),
			Underline.configure({
				HTMLAttributes: {
					class: 'underline',
				},
			}),
			Link.configure({
				protocols: ['http', 'https'],
				HTMLAttributes: {
					class: 'te',
				},
			}),
    ],
    editorProps: {
        attributes: {
            class: cn(`
                prose
                prose-lg
                prose-slate
                mx-auto
                mt-[10vh]
                pb-[50vh]
                prose-blockquote:text-base
                prose-blockquote:not-quote
                prose-blockquote:not-italic
                prose-blockquote:font-normal
                prose-blockquote:px-6
                prose-blockquote:py-3
                prose-blockquote:bg-slate-100
                prose-blockquote:rounded-lg
                prose-blockquote:border-none
                focus:outline-none
            `),
        },
    },
    content: `
    <h2>Editorのテスト！</h2>
    <p>
        <strong>控えめに言って最悪...</strong>だけど、RTA頑張るから！<s>あーやりたくねぇ...まじで</s><em>斜体！</em>
    </p>
    <ul>
        <li>
            箇条書き1
        </li>
        <li>
            箇条書き2
        </li>
    </ul>
    <ol>
        <li>
            番号書き1
        </li>
        <li>
            番号書き2
        </li>
    </ol>
    <pre><code class="language-prompt">masterpiece, best quality,{{{aaa}}}, (((bbb))), [[[ccc]]], (ddd:1.3), eee:1.3|fff:20 [ggg|hhh|iii|jjj], kkk AND lll, [mmm::2]</code></pre>
    <p>シンタックスハイライト書き直しとか泣けちゃう🥺</p>
    <blockquote>
        引用！引用！引用！
    </blockquote>
    <p>これもCSS書き直しなんて泣けてきちゃう</p>
		<p></p>
    `,
  })

  return (
    <>
      {editor && <BubbleMenu className="bg-white drop-shadow px-2 rounded-lg flex items-center h-12" tippyOptions={{ duration: 200, animation: "shift-away-subtle" }} editor={editor}>
				{editor.can().toggleBold() &&
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`h-full p-3.5 hover:bg-slate-50 stroke-2 ${editor.isActive('bold') ? 'text-sky-500' : ''}`}
					title="太字"
        >
          <Icon icon="fa-solid:bold" className='w-4 h-4' />
        </button>
				}
				{editor.can().toggleItalic() &&
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`h-full p-3.5 hover:bg-slate-50 stroke-2 ${editor.isActive('italic') ? 'text-sky-500' : ''}`}
					title="斜体"
        >
          <Icon icon="fa-solid:italic" className='w-4 h-4' />
        </button>
				}
				{editor.can().toggleStrike() &&
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`h-full p-3.5 hover:bg-slate-50 stroke-2 ${editor.isActive('strike') ? 'text-sky-500' : ''}`}
					title="取り消し線"
        >
          <Icon icon="fa-solid:strikethrough" className='w-4 h-4' />
        </button>
				}
				{editor.can().toggleUnderline() &&
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`h-full p-3.5 hover:bg-slate-50 stroke-2 ${editor.isActive('underline') ? 'text-sky-500' : ''}`}
					title="下線"
        >
          <Icon icon="fa-solid:underline" className='w-4 h-4' />
        </button>
				}
				{editor.can().toggleLink({ href: 'https://example.com', target: '_blank' }) &&
        <button
          onClick={() => editor.chain().focus().toggleLink({ href: 'https://example.com', target: '_blank' }).run()}
          className={`h-full p-3.5 hover:bg-slate-50 stroke-2 ${editor.isActive('underline') ? 'text-sky-500' : ''}`}
					title="リンク"
        >
          <Icon icon="fa-solid:link" className='w-4 h-4' />
        </button>
				}
				{editor.can().toggleBlockquote() &&
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`h-full p-3.5 hover:bg-slate-50 stroke-2 ${editor.isActive('blockquote') ? 'text-sky-500' : ''}`}
					title="引用"
        >
          <Icon icon="fa-solid:quote-left" className='w-4 h-4' />
        </button>
				}
				{editor.can().toggleCodeBlock() &&
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`h-full p-3.5 hover:bg-slate-50 stroke-2 ${editor.isActive('codeBlock') ? 'text-sky-500' : ''}`}
					title="コード"
        >
          <Icon icon="fa-solid:code" className='w-4 h-4' />
        </button>
				}
      </BubbleMenu>}
			{editor && <FloatingMenu className='w-0 h-0 relative left-[-90px] top-[-23px]' tippyOptions={{ duration: 200, animation: "shift-away-subtle" }} editor={editor}>
				<Menu as="div" className="relative inline-block text-left">
					<div>
						<Menu.Button className="p-2 border-2 rounded-full ">
          		<HiPlus className='w-6 h-6 drop-shadow-lg' />
						</Menu.Button>
					</div>
					<Transition
						as={Fragment}
						enter="transition ease-out duration-200"
						enterFrom="transform opacity-0 -translate-x-2"
						enterTo="transform opacity-100"
						leave="transition ease-in duration-75"
						leaveFrom="transform opacity-100"
						leaveTo="transform opacity-0 -translate-x-2"
					>
						<Menu.Items className="absolute left-14 top-0 z-10 w-56 origin-top-right rounded-md bg-white dark:bg-slate-800 drop-shadow ring-[1.5px] ring-black ring-opacity-5 focus:outline-none">
							<div className="py-1">
								<Menu.Item>
									<button
										className="w-full flex flex-row bg-gray-10 text-gray-900 dark:bg-slate-900 dark:text-slate-200 hover:bg-gray-100 px-4 py-2 text-sm cursor-pointer"
									>
										<Icon icon="heroicons:photo" className="text-gray-400 w-5 h-5 [&>path]:stroke-[2.5] mr-2" />
										画像
									</button>
								</Menu.Item>
                <Menu.Item>
									<button
										className="w-full flex flex-row bg-gray-10 text-gray-900 dark:bg-slate-900 dark:text-slate-200 hover:bg-gray-100 px-4 py-2 text-sm cursor-pointer"
									>
										<Icon icon="heroicons:link" className="text-gray-400 w-5 h-5 [&>path]:stroke-[2.5] mr-2" />
										埋め込み
									</button>
								</Menu.Item>
                <Menu.Item>
									<button
										className="w-full flex flex-row bg-gray-10 text-gray-900 dark:bg-slate-900 dark:text-slate-200 hover:bg-gray-100 px-4 py-2 text-sm cursor-pointer"
									>
										<Icon icon="fa-solid:quote-left" className="text-gray-400 p-0.5 w-5 h-5 mr-2 stroke-2" />
										引用
									</button>
								</Menu.Item>
                <Menu.Item>
									<button
										className="w-full flex flex-row bg-gray-10 text-gray-900 dark:bg-slate-900 dark:text-slate-200 hover:bg-gray-100 px-4 py-2 text-sm cursor-pointer"
									>
										<Icon icon="heroicons:code-bracket-square" className="text-gray-400 w-5 h-5 [&>path]:stroke-[2.5] mr-2" />
										コードブロック
									</button>
								</Menu.Item>
                <Menu.Item>
									<button
										className="w-full flex flex-row bg-gray-10 text-gray-900 dark:bg-slate-900 dark:text-slate-200 hover:bg-gray-100 px-4 py-2 text-sm cursor-pointer"
									>
										<Icon icon="material-symbols:horizontal-rule-rounded" className="text-gray-400 w-5 h-5 mr-2 stroke-2" />
										区切り線
									</button>
								</Menu.Item>
							</div>
						</Menu.Items>
					</Transition>
				</Menu>
      </FloatingMenu>}
      <EditorContent editor={editor} />
    </>
  )
}

export default Tiptap