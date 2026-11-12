import sharp from "sharp";
import { readdir, mkdir, stat } from "node:fs/promises";
import path from "node:path";

const input = "photos-original";
const output = "public/images/where-we-work";

await mkdir(output, { recursive: true });

const files = (await readdir(input)).filter((f) =>
  /\.(jpe?g|png|webp)$/i.test(f),
);
if (files.length === 0) {
  console.log(`No photos found in ${input}/`);
  process.exit(0);
}

for (const file of files) {
  const name = path.parse(file).name;
  const target = path.join(output, `${name}.webp`);
  await sharp(path.join(input, file))
    .rotate() // respect camera/phone orientation
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 72 })
    .toFile(target);
  const { size } = await stat(target);
  console.log(`${name}.webp  ${(size / 1024).toFixed(0)} KB`);
}
console.log("Done.");
