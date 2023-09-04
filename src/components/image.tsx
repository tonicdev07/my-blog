"use client";

import Image from "next/image";
import { FC, useState } from "react";

interface Props {
  product: any;
  fill?: boolean;
  custom?: boolean;
}

const CustomImage: FC<Props> = ({ product, fill, custom }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {fill ? (
        <Image
          src={product}
          alt={"product"}
          fill
          className={` duration-700 ease-in-out group-hover:opacity-75 ${
            isLoading
              ? "scale-110 blur-2xl grayscale"
              : "scale-100 blur-0 grayscale-0"
          }}`}
          onLoadingComplete={() => setIsLoading(false)}
        />
      ) : custom ? (
        <Image
          src={product}
          alt={product}
          className={` rounded-lg object-cover h-80 duration-700 ease-in-out group-hover:opacity-75 ${
            isLoading
              ? "scale-110 blur-2xl grayscale"
              : "scale-100 blur-0 grayscale-0"
          }}`}
          onLoadingComplete={() => setIsLoading(false)}
        />
      ) : (
        <Image
          src={product}
          alt={'avatar'}
          width={400}
          height={400}
          className={` border object-cover w-24 h-24 md:h-30 md:w-30 duration-700 ease-in-out group-hover:opacity-75 ${
            isLoading
              ? "scale-110 blur-2xl grayscale"
              : "scale-100 blur-0 grayscale-0"
          }}`}
          onLoadingComplete={() => setIsLoading(false)}
        />
      )}
    </>
  );
};

export default CustomImage;
