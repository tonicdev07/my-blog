"use client";

import React, { useEffect, useState } from "react";
import bgImage from "../assets/bg.jpg";
import CustomImage from "./image";
import { BsCamera } from "react-icons/bs";
import { usePost } from "@/context/context";

interface UserData {
  firstName: string;
  lastName: string;
  image: string;
  username: string;
  bio: string;
}
const ProfilePage = () => {
  const { session } = usePost() as any;

  useEffect(() => {
    const userData: UserData = {
      firstName: session?.user.firstName,
      lastName: session?.user.lastName,
      image: session?.user.image,
      username: session?.user.username,
      bio: session?.user.bio,
    };
    setUser(userData);
  }, [session]);

  const [user, setUser] = useState<UserData>();

  return (
    user && (
      <div className="max-w-[554px] mx-2 md:mx-auto mt-2  lg:max-w-2xl xl:max-w-3xl">
        <div className=" ">
          <div className="relative">
            <CustomImage product={bgImage} custom />
            <div className="rounded-full overflow-hidden bg-fill   absolute  top-10 left-10">
              <CustomImage product={user.image} />
              <div className="relative">
                <div className="absolute duration-300 avatar-img w-full flex justify-center  p-4 bg-[#181717cb] ">
                  <BsCamera className="text-2xl text-white " />
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="">
              <div className="mt-2 text-sm leading-3">Ism</div>
              <input
                id="firstname"
                className={` text-2xl mb-3 leading-[6px] text-[#525866]  dark:text-[#fff] font-semibold border border-transparent focus:outline-none w-full dark:bg-[#0e1217] bg-white  focus:border-transparent`}
                type="text"
                readOnly={false}
                value={user.firstName}
                onChange={(e) =>
                  setUser({
                    ...user,
                    firstName: e.target.value,
                  })
                }
              />
              <div className=" text-sm leading-3">Familya</div>
              <input
                className={`text-2xl leading-7 text-[#525866]  dark:text-[#fff] font-semibold border border-transparent focus:outline-none w-full dark:bg-[#0e1217] bg-white  focus:border-transparent`}
                type="text"
                readOnly={false}
                value={user.lastName}
                onChange={(e) =>
                  setUser({
                    ...user,
                    lastName: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex">
              <span className=" text-blue-600 font-[600]">@</span>
              <input
                className={`border border-transparent text-blue-600 font-[600] focus:outline-none w-full dark:bg-[#0e1217] bg-white  focus:border-transparent`}
                type="text"
                readOnly={false}
                value={user.username}
                onChange={(e) =>
                  setUser({
                    ...user,
                    username: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex items-center">
              <div className=" ">Bio</div>
              <div className="break-words border m-1 p-1 rounded-md leading-4">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Deserunt vitae veritatis, fuga labore iusto, voluptatum nemo
                odit, facilis dolor harum illum quis magni nulla distinctio
                officia consequuntur. Quod, nam sapiente.
              </div>
            </div>
            
          </div>
        </div>
      </div>
    )
  );
};

export default ProfilePage;
