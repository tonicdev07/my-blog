"use client";

import { makeRequest } from "@/services/makeRequest";
import { Dialog } from "@headlessui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

interface RequestBody {
  lastName: string;
  firstName: string;
  email: string;
  password: string;
  username: string;
}

export default function Register() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  if (session?.user) {
    return router.push("/");
  }

  async function postData(e: any) {
    setLoading(true)
    e.preventDefault();
    const body: RequestBody = {
      firstName: e.target[0].value,
      lastName: e.target[1].value,
      email: e.target[2].value,
      password: e.target[3].value,
      username: e.target[4].value,
    };

    await makeRequest("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        password: body.password,
        username: body.username,
      }),
    })
      .then(() => {
        toast.success("Ro'yxatdan o'tdingiz!");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      })
      .catch((e) => {
        toast.error("Ro'yxatga olishda muammo yuz berdi!");
      });
  }

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
            <div className="flex justify-center ">
              <form
                className="flex p-3 rounded-lg gap-4 max-w-96 md:w-96 justify-center bg-slate-200 mt-7 flex-col min-h-[80vh] "
                onSubmit={postData}
                method="post"
              >
                <input
                  className="p-2 placeholder:text-slate-400 w-full rounded-md"
                  type="text"
                  required
                  placeholder="Ism"
                />
                <input
                  className="p-2 placeholder:text-slate-400 w-full rounded-md"
                  type="text"
                  required
                  placeholder="Familya"
                />
                <input
                  className="p-2 placeholder:text-slate-400 w-full rounded-md"
                  type="email"
                  required
                  placeholder="Elektron pochta"
                />
                <input
                  className="p-2 placeholder:text-slate-400 w-full rounded-md"
                  type="password"
                  required
                  placeholder="Parol"
                />
                <input
                  className="p-2 placeholder:text-slate-400 w-full rounded-md"
                  type="text"
                  required
                  placeholder="Foydalanuvchi nomi"
                />

                <button

                  type="submit"
                  className="hover:border hover:bg-white hover:text-black transition-all bg-blue-600 rounded-lg text-white border-black w-32 py-1 mx-auto"
                >
                  {!loading ? "Yuklash" : "Yuklamoqda.."}
                </button>
              </form>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}
