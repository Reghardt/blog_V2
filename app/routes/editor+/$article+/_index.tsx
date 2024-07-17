import { DeleteObjectCommand, ListObjectsV2Command, PutObjectCommand } from "@aws-sdk/client-s3";
import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData, useSearchParams } from "@remix-run/react";
import { useState } from "react";
import invariant from "tiny-invariant";
import { z } from "zod";

import CopyIcon from "~/components/icons/copyIcon";
import CreateFolderIcon from "~/components/icons/createFolderIcon";
import DeleteIcon from "~/components/icons/deleteIcon";
import FolderIcon from "~/components/icons/folderIcon";
import LeftArrowIcon from "~/components/icons/leftArrowIcon";
import MinusIcon from "~/components/icons/MinusIcon";
import PlusIcon from "~/components/icons/plusIcon";
import UploadIcon from "~/components/icons/uploadIcon";
import { Button } from "~/components/spectrum/Button";
import { ZFormFileInputSchema } from "~/schemas/formFileInputSchema";
import { ZListObjectsCommandV2Response } from "~/schemas/listObjectsCommandV2Response";
import { S3Service } from "~/services/S3/S3Service.server";
import { createImageTag } from "~/utils/createImageTag";
import { moveUpOneDirectory } from "~/utils/moveUpOneDirectory";
import { uploadFile } from "~/utils/uploadFile";

export async function loader({ request }: LoaderFunctionArgs) {
  const prefix = new URL(request.url).searchParams.get("prefix") ?? "";

  const listResult = ZListObjectsCommandV2Response.parse(
    await S3Service.send(new ListObjectsV2Command({ Bucket: "rem-blog", Delimiter: "/", Prefix: prefix })),
  );
  console.log(listResult);

  invariant(process.env.AWS_S3_BUCKET_NAME, "AWS_S3_BUCKET_NAME undefined");
  invariant(process.env.AWS_S3_ENDPOINT, "AWS_S3_ENDPOINT undefined");

  return json({
    listResult,
    prefix,
    s3BucketName: process.env.AWS_S3_BUCKET_NAME,
    s3Endpoint: process.env.AWS_S3_ENDPOINT,
  });
}

export default function FileBrowser() {
  const loaderData = useLoaderData<typeof loader>();

  const [, setSearchParams] = useSearchParams();

  const [isMinimized, setIsMinimized] = useState(true);

  if (isMinimized) {
    return (
      <div className="fixed right-0 top-0 flex h-8 justify-end">
        <Button
          className={"flex h-8 w-12 items-center justify-center rounded-none p-0"}
          onPress={() => {
            setIsMinimized(!isMinimized);
          }}
        >
          <div>
            <PlusIcon />
          </div>
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed right-0 top-0 flex h-[96%] justify-end">
      <div>
        <div className="flex justify-end">
          <Button
            className={"flex h-8 w-12 items-center justify-center rounded-none p-0"}
            onPress={() => {
              setIsMinimized(!isMinimized);
            }}
          >
            <div>
              <MinusIcon />
            </div>
          </Button>
        </div>
        <div className="h-full w-96 overflow-auto bg-gray-50 shadow-xl">
          <div className="flex flex-col gap-2 p-2">
            <div>File browser</div>

            <div>
              <Button
                className={"p-1 px-2"}
                onPress={() => {
                  setSearchParams((prev) => {
                    prev.set("prefix", moveUpOneDirectory(loaderData.prefix));
                    return prev;
                  });
                }}
              >
                <div className="flex items-center gap-2">
                  <LeftArrowIcon />
                  Back
                </div>
              </Button>
            </div>

            <div>Path: {loaderData.prefix ? loaderData.prefix : ""}</div>

            <Form
              method="post"
              encType="multipart/form-data"
              className="border-1 flex flex-col gap-2 rounded border border-blue-400 p-2 px-2"
            >
              <input required type="file" name="user_document" />
              <Button name="_action" value={"upload_file"} type="submit" className={"p-1 px-2"}>
                <div className="flex items-center gap-2">
                  <UploadIcon />
                  Upload
                </div>
              </Button>
            </Form>

            <Form method="post" className="border-1 flex flex-col gap-2 rounded border border-blue-400 p-2">
              <input className="border" required type="text" name="folder_name" />
              <Button name="_action" value={"create_folder"} type="submit" className={"p-1 px-2"}>
                <div className="flex items-center gap-2">
                  <CreateFolderIcon />
                  Create folder
                </div>
              </Button>
            </Form>
            {loaderData.listResult.CommonPrefixes?.map((commonPrefix, index) => {
              return (
                <div key={index} className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    onPress={() => {
                      setSearchParams((prev) => {
                        prev.set("prefix", commonPrefix.Prefix);
                        return prev;
                      });
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <FolderIcon />
                      {commonPrefix.Prefix.replace(loaderData.prefix, "")}
                    </div>
                  </Button>
                  <Form method="post">
                    <Button
                      type="submit"
                      variant="destructive"
                      className={"p-0"}
                      name="_action"
                      value={"delete_folder"}
                    >
                      <DeleteIcon />
                    </Button>
                    <input type="hidden" name="common_prefix_to_delete" value={commonPrefix.Prefix} />
                  </Form>
                </div>
              );
            })}

            <div className="flex flex-col gap-4">
              {loaderData.listResult.Contents?.map((content, index) => {
                if (content.Size > 0) {
                  return (
                    <div key={index} className="flex flex-col gap-2 rounded shadow-md">
                      <img
                        width={"100%"}
                        height={"auto"}
                        alt="uploaded by user"
                        src={loaderData.s3Endpoint + "/" + loaderData.s3BucketName + "/" + content.Key}
                      />

                      <div className="flex w-full items-center justify-between text-center">
                        <div className="flex items-center gap-2">
                          <Button
                            className={"p-1 px-2"}
                            onPress={() => {
                              void navigator.clipboard.writeText(
                                createImageTag(loaderData.s3Endpoint, loaderData.s3BucketName, content.Key),
                              );
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <CopyIcon />
                              Copy
                            </div>
                          </Button>
                          <div>{content.Key.replace(loaderData.prefix, "")}</div>
                        </div>
                        <Form method="post">
                          <Button
                            type="submit"
                            variant="destructive"
                            className={"p-0"}
                            name="_action"
                            value={"delete_folder"}
                          >
                            <DeleteIcon />
                          </Button>
                          <input type="hidden" name="common_prefix_to_delete" value={content.Key} />
                        </Form>
                      </div>
                    </div>
                  );
                } else return null;
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const action = z.string().parse(formData.get("_action"));

  const prefix = new URL(request.url).searchParams.get("prefix") ?? "";

  if (action === "upload_file") {
    const file = ZFormFileInputSchema.parse(formData.get("user_document"));
    console.log(file);

    await uploadFile(file, prefix, file.name);
  } else if (action === "create_folder") {
    const folderName = z.string().parse(formData.get("folder_name"));
    invariant(process.env.AWS_S3_BUCKET_NAME, "AWS_S3_BUCKET_NAME undefined");
    await S3Service.send(
      new PutObjectCommand({
        Key: prefix + folderName + "/",
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        ContentLength: 0,
      }),
    );
  } else if (action === "delete_folder") {
    invariant(process.env.AWS_S3_BUCKET_NAME, "AWS_S3_BUCKET_NAME undefined");

    const commonPrefixToDelete = z.string().parse(formData.get("common_prefix_to_delete"));
    console.log(commonPrefixToDelete);
    const deleteObjectRes = await S3Service.send(
      new DeleteObjectCommand({
        Key: commonPrefixToDelete,
        Bucket: process.env.AWS_S3_BUCKET_NAME,
      }),
    );
    console.log(deleteObjectRes);
  }
  return null;
}
