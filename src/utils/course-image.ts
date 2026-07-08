export function getCourseImagePath(path: string) {
  return path
    .replace("-banner", "")
    .replace("-thumb", "")
    .replace(/\.webp$/i, ".svg");
}
