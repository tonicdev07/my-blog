"use client";
import React from "react";

import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { BsGithub } from "react-icons/bs";

import { useSearchParams, useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";

const Login = () => {
  const router = useRouter();
  const session = useSession();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  if (session.status === "authenticated") return <>{router.push("/")}</>;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      const res = await signIn("credentials", {
        redirect: false,
        username: formValues.username,
        password: formValues.password,
        callbackUrl,
      });

      setLoading(false);
      if (!res?.error) {
        router.push(res?.url as any);
      } else {
        setError("Email yoki parol xato!");
      }
    } catch (error: any) {
      setLoading(false);
      setError(error);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const input_style =
    "form-control block w-full px-4 py-5 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none";

  return (
    <form onSubmit={onSubmit}>
      {error && (
        <p className="text-center bg-red-300 py-4 mb-6 rounded">{error}</p>
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
      {loading ? (
        <div className="flex justify-center">
          <div className="spinner-container">
            <div className="spinner">
              <div className="spinner">
                <div className="spinner">
                  <div className="spinner">
                    <div className="spinner">
                      <div className="spinner"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
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
            onClick={() => {
              setLoading(true);
              signIn("google");
            }}
            role="button"
          >
            <FcGoogle className=" text-lg" />
            &nbsp; orqali kirish
          </a>
          <div>
            <span>Account yo&apos;qmi? </span>
            <Link className=" text-sm text-blue-600" href={"/signup"}>
              Ro&apos;yxatdan o&apos;tish
            </Link>
          </div>
        </>
      )}
    </form>
  );
};

export default Login;
