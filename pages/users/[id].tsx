import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";
import Header from "../../components/header/header";

const fetcher = (url) => fetch(url).then((r) => r.json());

const UserPage = () => {
    const router = useRouter()
    const { id } = router.query;
    const { data, error } = useSWR(`../../api/users/${id}`, fetcher);

    return (
        <div>
            <Header></Header>
            {id}
        </div>
    )
}

export default UserPage;