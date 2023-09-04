"use client";

import React, { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { AiFillEnvironment } from "react-icons/ai";
import { Tooltip } from "antd";
import Link from "next/link";
import ThemeButton from "./themeButton";

const CustomMenu: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex relative">
      <div className={` fixed h-screen top-0 lg:static  z-50 lg:bg-none`}>
        <div
          className={` border-r  min-h-screen pt-8 ${
            open ? "w-64" : "w-12 left-[-70px]"
          } duration-300  lg:left-0 relative z-50  dark:bg-[#212a35] `}
        >
          <IoIosArrowBack
            className={`child dark:bg-[#0e1217] bg-white dark:text-[#cbd5f0] text-2xl rounded-full absolute  lg:-right-3 top-2 dark:border-white border cursor-pointer ${
              !open ? "-right-14 top-[70px] lg:top-2  rotate-180" : "right-2"
            } duration-1000 `}
            onClick={() => setOpen(!open)}
          />
          <Link href={"/"} className={`${open && "flex flex-col"}  `}>
            <div
              className={`px-3 py-[2px] cursor-pointer ${
                !open && "w-12"
              }  dark:hover:bg-slate-800 hover:bg-slate-200 inline-flex  items-center`}
            >
              <Tooltip placement="right" title="Location" color="black">
                <AiFillEnvironment
                  className={` text-xl rounded cursor-pointer block float-left  duration-500 ${
                    open && " rotate-[360deg]"
                  }`}
                />
              </Tooltip>
              <div
                className={`origin-left ml-2 font-medium  duration-300 ${
                  !open && "hidden"
                }`}
              >
                TailwindCss
              </div>
            </div>
            <ThemeButton />
          </Link>
        </div>
      </div>
      <div
        className={`bg-[#282626a0] dark:bg-[#585656e6] fixed z-40 top-0 h-screen right-0 ${
          open && "w-full lg:w-0"
        }`}
        onClick={() => setOpen(!open)}
      ></div>
    </div>
  );
};

export default CustomMenu;
