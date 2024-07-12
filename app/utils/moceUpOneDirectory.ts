export function moveUpOneDirectory(path: string) {
  // Split the path by '/' to handle individual directories
  const parts = path.split("/");

  // Remove trailing empty strings from the split array (in case of trailing slashes)
  while (parts.length > 0 && parts[parts.length - 1] === "") {
    parts.pop();
  }

  // If path is just '/', return '/'
  if (parts.length === 0) {
    return "/";
  }

  // Remove the last directory in the path
  parts.pop();

  // Join the remaining parts to form the new path
  const newPath = parts.join("/");

  return newPath;
}
