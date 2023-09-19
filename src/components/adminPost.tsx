"use client";

import React, { useState } from "react";
import { TagsInput } from "react-tag-input-component";
import UploadButtonPage from "./uploadButton";
import { makeRequest } from "@/services/makeRequest";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import ReactTable from "./reactTable";

const AdminPost = () => {
  const [postName, setPostName] = useState("");
  const [stop, setStop] = useState(false);
  const [desc, setDesc] = useState("");
  const [selected, setSelected] = useState([]) as any;
  const [images, setImages] = useState<{
    fileUrl: string;
    fileKey: string;
  }>({ fileUrl: "", fileKey: "" }) as any;
  const { data: session } = useSession() as any;

  const loginFormSchema = z.object({
    title: z
      .string()
      .min(10, { message: "Matin nomi 10 ta so'zdan kam bo'lmasligi kerak!" }),
    body: z
      .string()
      .min(20, { message: "Matin nomi 20 ta so'zdan kam bo'lmasligi kerak!" }),
    imageUrl: z.string().min(20, { message: "rasm mavjud emas!" }),
  });

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(loginFormSchema),
  });

  const onSubmit: SubmitHandler<ValidationSchema> = (data) => {
    setStop(true);
    setPost();
    reset();
  };

  async function setPost(): Promise<any> {
    const datas = {
      title: postName,
      body: desc,
      tags: selected,
      imageUrl: images.fileUrl,
      imageKey: images.fileKey,
    };
    try {
      const url = `/api/post`;
      const data = await makeRequest(url, {
        method: "POST",
        data: datas,
        headers: {
          authorization: session?.user.accessToken,
        },
      });

      if (data && data?.check !== false) {
        reset();
        toast.success("Post yuklandi!");
        setPostName("");
        setDesc("");
        setSelected([]);
        setImages({ fileUrl: "", fileKey: "" });
        setStop(false);
      }
    } catch (err) {
      console.log(err);
    }
  }

  type ValidationSchema = z.infer<typeof loginFormSchema>;

  return (
    <div className="flex flex-col gap-3">
      <form
        onSubmit={(e) => e.preventDefault()}
        className=" text-center w-[500px] mx-auto"
      >
        <div className="  border-b border-teal-500 py-2">
          <input
            className={`w-full px-3 py-2 text-sm leading-tight  border ${
              errors.title && "border-red-500"
            } rounded appearance-none focus:outline-none focus:shadow-outline`}
            type="text"
            // value={postName}
            placeholder="Post nomi"
            aria-label="Post nomi"
            {...register("title")}
            onBlur={(e) => setPostName(e.target.value)}
          />
          <div>
            {errors.title && (
              <p className="text-xs italic text-red-500 mb-2">
                {errors.title?.message}
              </p>
            )}
          </div>
        </div>
        <div className="border-b border-teal-500 py-2">
          <textarea
            className={`w-full px-3 py-2 text-sm leading-tight  border ${
              errors.body && "border-red-500"
            } rounded appearance-none focus:outline-none focus:shadow-outline`}
            {...register("body")}
            placeholder="Post haqida ma'lumot"
            onBlur={(e) => setDesc(e.target.value)}
          />
          {errors.body && (
            <p className="text-xs italic text-red-500 mb-2">
              {errors.body?.message}
            </p>
          )}
        </div>
        <div className="my-4">
          <TagsInput
            value={selected}
            onChange={setSelected}
            name="tags"
            placeHolder="tags"
          />
        </div>
        <UploadButtonPage images={images} setImages={setImages} />
        <input
          className=" block opacity-0 "
          value={images?.fileUrl}
          {...register("imageUrl")}
        />
        {errors.imageUrl && (
          <p className="text-xs italic text-red-500 ">
            {errors.imageUrl?.message}
          </p>
        )}
        <button
          disabled={stop}
          className={` ${
            !stop ? "bg-blue-600" : "bg-blue-300"
          } p-1 px-4 rounded-md text-white`}
          onClick={handleSubmit(onSubmit)}
        >
          Post
        </button>
      </form>

      <ReactTable />
    </div>
  );
};

export default AdminPost;
