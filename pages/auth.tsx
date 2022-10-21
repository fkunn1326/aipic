import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { useHash } from '../utils/useHash'
import { supabaseClient } from "@supabase/auth-helpers-nextjs";

const AuthPage = () => {
    const [hash, setHash] = useHash()
    const [isok, setisok] = useState(false)
    const router = useRouter()
    const query = router.query;

    useEffect(() => {
        if(router.isReady) {
            hash.startsWith('access_token=') ? setisok(true) : setisok(false);
            setTimeout(() => {
                router.push('/')
            }, 3000);
        }
    }, [])

    return(
        <div className="bg-gray-50 pt-10 mb-10">
        <div className="flex flex-col items-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
            href="#"
            className="flex items-center mb-6 text-2xl font-semibold text-gray-900"
        >
            AI Arts
        </a>
        <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-center font-bold leading-tight tracking-tight text-gray-900">
                {isok ? "ログインに成功しました" : "ログイン中にエラーが発生しました。"}
            </h1>
            <p className="text-center font-bold leading-tight tracking-tight text-gray-900">
                リダイレクトしています...
            </p>
            </div>
        </div>
        </div>
    </div>
    )
}

export default AuthPage;