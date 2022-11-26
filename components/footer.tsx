import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faFacebook,
  faLine,
} from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <footer className="mx-auto px-4 md:px-8 max-w-xl mb:px-0 sm:max-w-7xl dark:bg-slate-900">
      <div className="mt-10 pt-10 pb-28 border-t border-slate-200 dark:border-slate-700 sm:flex justify-between text-slate-500 dark:text-slate-300">
        <div className="mb-6 sm:mb-0 sm:flex items-center space-y-2">
          <p>AIPIC</p>
          <p className="text-sm sm:ml-4 sm:pl-4 sm:border-l dark:border-slate-700 sm:border-slate-200">
            <Link href="/terms/tos">
              <a className="text-sky-600 hover:underline">利用規約</a>
            </Link>
          </p>
          <p className="text-sm sm:ml-4">
            <Link href="/terms/privacy_policy">
              <a className="text-sky-600 hover:underline">
                プライバシーポリシー
              </a>
            </Link>
          </p>
          <p className="text-sm sm:ml-4">
            <Link href="/terms/guideline">
              <a className="text-sky-600 hover:underline">ガイドライン</a>
            </Link>
          </p>
          <p className="text-sm sm:ml-4">
            <a
              href="https://forms.gle/gQWnPFDXqSmu8NqCA"
              className="text-sky-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              お問い合わせフォーム
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
