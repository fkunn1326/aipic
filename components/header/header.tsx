import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link'
import Dropdown from './dropdown'
import { userInfoContext } from '../../context/userInfoContext'

const Header = () => {
    const ctx = useContext(userInfoContext);

    const [update,setUpdata]=useState<boolean>(false)

    return(
        <div className="relative bg-white border" onLoad={() => setUpdata(update?false:true)}>
            <div className="mx-auto max-w-7xl">
                <div className="flex items-center justify-between py-3 md:justify-start md:space-x-10">
                    <div className="flex justify-start lg:w-0 lg:flex-1">
                        <Link href="/">
                            <p className="cursor-pointer text-2xl">AI Arts</p>
                        </Link>
                    </div>
                    {ctx.UserInfo === false ?
                    <div className="hidden items-center justify-end md:flex md:flex-1 lg:w-0">
                        <Link href="/signin">
                            <a className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900">
                                サインイン
                            </a>
                        </Link>
                        <Link href="/signup">
                            <a className="ml-8 inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-sky-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-sky-600">
                                サインアップ
                            </a>
                        </Link>
                    </div>
                    :
                    <div className="hidden items-center justify-end md:flex md:flex-1 lg:w-0">
                        <Link href="/upload">
                            <a className="mr-8 inline-flex items-center justify-center whitespace-nowrap rounded-full border border-transparent bg-sky-500 px-6 py-2 text-base font-bold text-white shadow-sm hover:bg-sky-600">
                                作品を投稿
                            </a>
                        </Link>                       
                        <Dropdown avatar={ctx.UserInfo["avatar_url"]}></Dropdown>
                    </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default Header