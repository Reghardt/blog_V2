import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { unstable_defineAction as defineAction, unstable_defineLoader as defineLoader } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";

import { ZListObjectsCommandV2Response } from "~/schemas/listObjectsCommandV2Response";
import { S3Service } from "~/services/s3.server";
import { moveUpOneDirectory } from "~/utils/moceUpOneDirectory";

export const loader = defineLoader(async ({ request, params }) => {
  const prefix = new URL(request.url).searchParams.get("prefix") ?? "";
  // console.log(await S3Service.send(new ListBucketsCommand("")));
  // console.log(await S3Service.send(new ListObjectsV2Command({ Bucket: "rem-blog", Delimiter: "/" })));

  const listResult = ZListObjectsCommandV2Response.parse(
    await S3Service.send(new ListObjectsV2Command({ Bucket: "rem-blog", Delimiter: "/", Prefix: prefix })),
  );
  console.log(listResult);
  return { listResult, prefix };
});

export default function FileBrowser() {
  const loaderData = useLoaderData<typeof loader>();

  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <div>
      <div>File browser</div>
      <div>
        <button
          onClick={() => {
            setSearchParams((prev) => {
              prev.set("prefix", moveUpOneDirectory(loaderData.prefix));
              return prev;
            });
            // console.log(moveUpOneDirectory(loaderData.prefix));
          }}
        >
          Up
        </button>
      </div>
      <div>Current folder: {loaderData.prefix ? loaderData.prefix : "/"}</div>
      {loaderData.listResult.CommonPrefixes?.map((commonPrefix, index) => {
        return (
          <div key={index}>
            <button
              className="rounded bg-blue-800 p-2 py-1 text-white"
              onClick={() => {
                setSearchParams((prev) => {
                  prev.set("prefix", commonPrefix.Prefix);
                  return prev;
                });
              }}
            >
              {commonPrefix.Prefix}
            </button>
          </div>
        );
      })}

      {loaderData.listResult.Contents?.map((content, index) => {
        if (content.Size > 0) {
          return <div key={index}>{content.Key.replace(loaderData.prefix, "")}</div>;
        } else return null;
      })}
    </div>
  );
}

export const action = defineAction((request) => {
  return null;
});
