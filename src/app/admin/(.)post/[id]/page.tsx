"use client";

import React, { useEffect, useState } from "react";
import { TagsInput } from "react-tag-input-component";
import { makeRequest } from "@/services/makeRequest";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { Dialog } from "@headlessui/react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "react-query";
import UploadButtonPage from "@/components/uploadButton";

export default function Post() {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();
  const [postName, setPostName] = useState("");
  const [stop, setStop] = useState(false);
  const [desc, setDesc] = useState("");
  const [form, setForm] = useState({}) as any;
  const [selected, setSelected] = useState([]) as any;
  const [images, setImages] = useState<{
    fileUrl: string;
    fileKey: string;
  }>({ fileUrl: "", fileKey: "" }) as any;
  const { data: session } = useSession() as any;
  const { id } = useParams();

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

  async function setPost(): Promise<any> {
    const datas = {
      id: form.id,
      title: form.title,
      body: form.body,
      imgId: form.images[0].id,
      imageUrl: form.images[0].imageUrl,
      imageKey: form.images[0].imageKey,
    };
    
    try {
      const url = `/api/post/update`;
      const data = await makeRequest(url, {
        method: "POST",
        data: datas,
        headers: {
          authorization: session?.user.accessToken,
        },
      });

      if (data && data?.check !== false) {
        reset();
        toast.success("Post yangilandi!");
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

  const onSubmit: SubmitHandler<ValidationSchema> = (data) => {
    setStop(true);
    setPost();
    reset();
  };

  const {
    refetch,
    data: post,
    isLoading: loading,
    error,
  } = useQuery(
    ["postId"],
    () =>
      makeRequest(`/api/post/${id}`, {
        method: "GET",
        headers: {
          authorization: session.user.accessToken,
        },
      }),
    {
      enabled: !!session,
    }
  );

  useEffect(() => {
    refetch()
    setForm(post);
  },[post]);

  const onChangeHandler = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  if (error) return <>{JSON.stringify(error)}</>;

  type ValidationSchema = z.infer<typeof loginFormSchema>;

  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        setIsOpen(false);
        router.back();
      }}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-[#2955a67d]" aria-hidden="true" />

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <Dialog.Panel
            className={
              "mx-auto max-w-5xl rounded-xl border dark:border-white dark:bg-[#1c1f26] bg-[#dcd4d4f7] p-3 md:p-10"
            }
          >
            {loading ? (
              <div className="h-8 w-8 rounded-full border-2 border-dotted border-blue-600 animate-spin" />
            ) : (
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
                    value={form?.title}
                    placeholder="Post nomi"
                    aria-label="Post nomi"
                    {...register("title")}
                    onChange={onChangeHandler}
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
                    value={form?.body}
                    className={`w-full min-h-[200px] px-3 py-2 text-sm leading-tight  border ${
                      errors.body && "border-red-500"
                    } rounded appearance-none focus:outline-none focus:shadow-outline`}
                    {...register("body")}
                    placeholder="Post haqida ma'lumot"
                    onChange={onChangeHandler}
                  />
                  {errors.body && (
                    <p className="text-xs italic text-red-500 mb-2">
                      {errors.body?.message}
                    </p>
                  )}
                </div>
                {form?.images && (
                  <UploadButtonPage images={form} setImages={setForm} custom />
                )}
                {form?.images && (
                  <input
                    className=" block opacity-0 "
                    value={form?.images[0]?.imageUrl}
                    {...register("imageUrl")}
                  />
                )}
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
            )}
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}
