export function createImageTag(s3Endpoint: string, s3BucketName: string, Key: string) {
  return `<img
    src="${encodeURI(`${s3Endpoint}/${s3BucketName}/${Key}`)}" 
    alt="Description" 
    width="100%"
    style="margin: auto;"
/>`;
}
