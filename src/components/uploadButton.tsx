"use client";

import "@uploadthing/react/styles.css";
import { UploadButton } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import Image from "next/image";
import { makeRequest } from "@/services/makeRequest";
import { toast } from "react-toastify";

export default function UploadButtonPage({ setImages, images, custom }: any) {
  const deleteImages = async (image: any) => {
    try {
      const url = `/api/uploadthing/delete`;
      const data = await makeRequest(url, {
        method: "POST",
        data: { urlKey: image.key },
      });
      if (data.success === true) {
        toast.success("image delete!")
        !custom
          ? setImages({ fileUrl: "", fileKey: "" })
          : setImages({
              ...images,
              images: [
                {
                  id: images.images[0].id,
                  imageUrl: "",
                  imageKey: "",
                },
              ],
            });
      }
    } catch (err) {
      console.log(err);
      !custom
        ? setImages({ fileUrl: "", fileKey: "" })
        : setImages({
            ...images,
            images: [
              {
                id: images.images[0].id,
                imageUrl: "",
                imageKey: "",
              },
            ],
          });
    }
  };

  const title = custom ? (
    images?.images[0]?.imageKey ? (
      <>
        <p>Upload Complete!</p>
        {/* <p className="mt-2">{images.fileUrl.length} files</p> */}
      </>
    ) : null
  ) : images?.fileUrl?.length ? (
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
          {custom ? (
            <>
              <button
                onClick={() => deleteImages({ key: images.images[0].imageKey })}
              >
                delete
              </button>
              <Image
                alt="image.fileUrl"
                src={images?.images[0].imageUrl}
                height={100}
                width={100}
              />
            </>
          ) : (
            <>
              <button onClick={() => deleteImages({ key: images.fileKey })}>
                delete
              </button>
              <Image
                alt="image.fileUrl"
                src={images?.fileUrl}
                height={100}
                width={100}
              />
            </>
          )}
        </ul>
      )}
    </>
  );

  return (
    <main className="">
      {custom ? (
        !images.images[0].imageKey && (
          <UploadButton<OurFileRouter>
            endpoint="imageUploader"
            onClientUploadComplete={(res: any) => {
              if (res as any) {
                setImages({
                  ...images,
                  images: [
                    {
                      id: images.images[0].id,
                      imageUrl: res[0]?.fileUrl,
                      imageKey: res[0]?.fileKey,
                    },
                  ],
                });

                // Do something with the response
              }
              //   alert("Upload Completed");
            }}
            onUploadError={(error: Error) => {
              // Do something with the error.
              alert(`ERROR! ${error.message}`);
            }}
          />
        )
      ) : (
        <UploadButton<OurFileRouter>
          endpoint="imageUploader"
          onClientUploadComplete={(res: any) => {
            if (res as any) {
              const json = JSON.stringify(res);

              setImages({
                fileUrl: res[0]?.fileUrl,
                fileKey: res[0].fileKey,
              });

              // Do something with the response
            }
            //   alert("Upload Completed");
          }}
          onUploadError={(error: Error) => {
            // Do something with the error.
            alert(`ERROR! ${error.message}`);
          }}
        />
      )}
      {imgList}
    </main>
  );
}
