"use client";

import "@uploadthing/react/styles.css";
import { UploadButton } from "@uploadthing/react";
import Link from "next/link";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import Image from "next/image";
import { makeRequest } from "@/services/makeRequest";

export default function UploadButtonPage({ setImages, images }: any) {
  const deleteImages = async (image: any) => {
    try {
      const url = `/api/uploadthing/delete`;
      const data = await makeRequest(url, {
        method: "POST",
        data: { urlKey: image.key },
      });
      if (data.success === true) {
        setImages({ fileUrl: "", fileKey: "" });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const title = images?.fileUrl?.length ? (
    <>
      <p>Upload Complete!</p>
      <p className="mt-2">{images.fileUrl.length} files</p>
    </>
  ) : null;

  const imgList = (
    <>
      {title}
      {title && (
        <ul>
          <button onClick={() => deleteImages({ key: images.fileKey })}>
            delete
          </button>
          <Image
            alt="image.fileUrl"
            src={images?.fileUrl}
            height={100}
            width={100}
          />
        </ul>
      )}
    </>
  );

  return (
    <main className="">
      <UploadButton<OurFileRouter>
        endpoint="imageUploader"
        onClientUploadComplete={(res: any) => {
          if (res as any) {
            setImages({ fileUrl: res[0]?.fileUrl, fileKey: res[0].fileKey });
            const json = JSON.stringify(res);

            // Do something with the response
          }
          //   alert("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />
      {imgList}
    </main>
  );
}
