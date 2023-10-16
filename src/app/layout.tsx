import "./globals.css";
import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const montserrat = Raleway({ subsets: ["latin"] });
import ico from "../../public/favicon.ico";
import Provider from "./provider";
import AppBar from "@/components/AppBar";


export const metadata: Metadata = {
  title: "Anvarbek Xaydarov",
  description: "Salom do'stlar IT sohasi bo'yicha qaynoq yangiliklarni qo'yib boruvchi blog saytimga xush kelibsiz!!!",
  icons: [{ rel: "icon", url: ico.src }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} `}>
        <Provider>
          <div className=" max-w-7xl mx-auto">
            <ToastContainer />
            <AppBar />
            <div className=" w-full">{children}</div>
          </div>
        </Provider>
      </body>
    </html>
  );
}
