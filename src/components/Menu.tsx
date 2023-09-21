"use client";

import React, { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { CiLight } from "react-icons/ci";
import { MdDarkMode } from "react-icons/md";
import { AiOutlineLike } from "react-icons/ai";
import { LiaComment } from "react-icons/lia";
import { Tooltip } from "antd";
import Link from "next/link";
import { useTheme } from "next-themes";
import { usePost } from "@/context/context";

const CustomMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { setFilter, filter }: any = usePost();
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <div className="flex relative">
      <div
        className={` hidden lg:block pt-8 ${
          open ? "w-64" : "w-12 left-[-70px]"
        } duration-300  lg:left-0 relative z-50`}
      ></div>
      <div className={` fixed h-screen top-0 lg:top-14  z-50 lg:bg-none`}>
        <div
          className={` border-r    min-h-screen pt-8 ${
            open ? "w-64" : "w-12 left-[-70px]"
          } duration-300  lg:left-0 relative z-50  dark:bg-[#0e1217] md:bg-[#ffffff]  bg-[#d6d6d6]  `}
        >
          <IoIosArrowBack
            className={` dark:bg-[#0e1217] bg-white dark:text-[#cbd5f0] text-xl rounded-full absolute  lg:-right-3 top-2 dark:hover:border-slate-400 border cursor-pointer ${
              !open ? "-right-14 top-[70px] lg:top-2  rotate-180" : "right-2"
            } duration-1000 `}
            onClick={() => setOpen(!open)}
          />
          <div className="flex flex-col h-[60vh] justify-between">
            <div>
              <Link
                onClick={() => setOpen(false)}
                href={"/"}
                className={`${open && "flex my-2 flex-col"}  `}
              >
                <div
                  onClick={() =>
                    setFilter((prew: any) =>
                      !prew.filterComment || prew.filterComment === "desc"
                        ? { filterLike: "desc" }
                        : { filterLike: "" }
                    )
                  }
                  className={`px-3 py-[2px] cursor-pointer ${!open && "w-12"} ${
                    filter.filterLike === "desc" &&
                    "bg-slate-200 dark:bg-slate-700"
                  }  dark:hover:bg-slate-700 hover:bg-slate-200 inline-flex  items-center`}
                >
                  <Tooltip placement="right" title="Location" color="black">
                    <AiOutlineLike
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
                    Top likelar
                  </div>
                </div>
              </Link>
              <Link
                onClick={() =>
                  setFilter((prew: any) =>
                    !prew.filterLike || prew.filterLike === "desc"
                      ? { filterComment: "desc" }
                      : { filterComment: "" }
                  )
                }
                href={"/"}
                className={`${open && "flex flex-col"}  `}
              >
                <div
                  onClick={() =>
                    setFilter({ filterLike: "desc" }, setOpen(false))
                  }
                  className={`px-3 py-[2px] cursor-pointer ${!open && "w-12"} ${
                    filter.filterComment === "desc" &&
                    "bg-slate-200 dark:bg-slate-700"
                  } dark:hover:bg-slate-700 hover:bg-slate-200 inline-flex  items-center`}
                >
                  <Tooltip placement="right" title="Location" color="black">
                    <LiaComment
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
                    Top suhbatlar
                  </div>
                </div>
              </Link>
            </div>
            <div  onClick={() => setOpen(false)} className={`${open && "flex flex-col"}  `}>
              <div
                className={`px-3 py-[2px] cursor-pointer ${
                  !open && "w-12"
                }  dark:hover:bg-slate-800 hover:bg-slate-200 inline-flex  items-center`}
                onClick={() =>
                  currentTheme == "dark" ? setTheme("light") : setTheme("dark")
                }
              >
                {currentTheme == "dark" ? (
                  <CiLight className=" text-xl font-semibold" />
                ) : (
                  <MdDarkMode className=" text-xl" />
                )}

                <div
                  className={`origin-left ml-2 font-medium  duration-300 ${
                    !open && "hidden"
                  }`}
                >
                  {currentTheme !== "dark" ? "Dark" : "Light"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`bg-[#282626a0] dark:bg-[#141313ba] fixed z-40 top-0 h-screen right-0 ${
          open && "w-full lg:w-0"
        }`}
        onClick={() => setOpen(!open)}
      ></div>
    </div>
  );
};

export default CustomMenu;
