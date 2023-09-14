"use client";

import { Dialog } from "@headlessui/react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";

export const LoginForm = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      const res = await signIn("credentials", {
        redirect: false,
        username: formValues.username,
        password: formValues.password,
        // callbackUrl,
      });

      setLoading(false);
      if (!res?.error) {
        router.push(callbackUrl);
      } else {
        setError("Email yoki parol xato!");
      }
    } catch (error: any) {
      setLoading(false);
      setError(error);
    }
  };

  async function SignGoogle() {
    await signIn("google");
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const input_style =
    "form-control block w-full px-4 py-5 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none";

  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        setIsOpen(false);
        // router.back();
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
            <form onSubmit={onSubmit}>
              {error && (
                <p className="text-center bg-red-300 py-4 mb-6 rounded">
                  {error}
                </p>
              )}
              <div className="mb-6">
                <input
                  required
                  type="text"
                  name="username"
                  value={formValues.username}
                  onChange={handleChange}
                  placeholder="Elektron pochta"
                  className={`${input_style}`}
                />
              </div>
              <div className="mb-6">
                <input
                  required
                  type="password"
                  name="password"
                  value={formValues.password}
                  onChange={handleChange}
                  placeholder="Parol"
                  className={`${input_style}`}
                />
              </div>
              <button
                type="submit"
                style={{ backgroundColor: `${loading ? "#ccc" : "#3446eb"}` }}
                className="inline-block px-7 py-4 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full"
                disabled={loading}
              >
                {loading ? "loading..." : "Kirish"}
              </button>

              <div className="flex items-center my-4 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5">
                <p className="text-center font-semibold mx-4 mb-0">YOKI</p>
              </div>

              <a
                className="px-7 py-2 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out w-full flex justify-center items-center mb-3"
                style={{ backgroundColor: "#3b5998" }}
                onClick={SignGoogle}
                role="button"
              >
                Google orqali kirish
              </a>
              <div>
                <span>Account yo&apos;qmi? </span>
                <Link className=" text-sm text-blue-600" href={"/signup"}>
                  Ro&apos;yxatdan o&apos;tish
                </Link>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
};
