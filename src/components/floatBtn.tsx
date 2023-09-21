"use client";

import React from "react";
import { Button, Popover, Space, Tooltip } from "antd";
import Image from "next/image";
import { CgProfile, CgLogOut } from "react-icons/cg";
import Link from "next/link";
import { signOut } from "next-auth/react";
interface FloatBtnProps {
  user: any; // This should match the expected type of 'user'
}
const content = (
  <div className="p-1 ">
    <Link href={"/profile"} className="flex mb-2 items-center gap-1 ">
      <CgProfile className=" text-xl" />
      <div>Profile</div>
    </Link>
    <div
      className="flex hover:text-red-500  items-center gap-1 "
      onClick={() => signOut()}
    >
      <CgLogOut className=" text-xl" />
      <button>Logout</button>
    </div>
  </div>
);

const FloatBtn: React.FC<FloatBtnProps> = ({ user }: any) => (
  <Space wrap>
    <Popover
      content={content}
      // color="#252f3b"
      className=" z-50"
      placement="leftBottom"
      trigger="click"
    >
      <Button className=" rounded-full h-8 w-8">
        <Image
          src={user.image}
          className="rounded-full"
          alt={user.lastName}
          fill
        />
      </Button>
    </Popover>
  </Space>
);

export default FloatBtn;
