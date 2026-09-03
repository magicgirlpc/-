import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const out = join(process.cwd(), "public/sites/pacomepertant-com-b16b412f/root-8a5edab2");
const sanity = "https://cdn.sanity.io/images/u7lvkmbp/production";
const assets = [
  ["fonts/Indivisible-Regular.woff2", "https://pacomepertant.com/_nuxt/Indivisible-Regular.DGbWVM74.woff2"],
  ["showreel-thumbnail.png", "https://pacomepertant.com/_nuxt/reel-thumbnail.Cx_2hmdl.png"],
  ["favicon.svg", "https://pacomepertant.com/favicon.svg"],
  ["projects/paths-of-life.png", `${sanity}/53f8a4a889052e6d9f92fc347533062abaf7c28a-1396x770.png`],
  ["projects/tiktok.png", `${sanity}/19fa225f5d92c65608e2234c0b0bd1fb2e3d681c-3840x1920.png`],
  ["projects/psychedelics.png", `${sanity}/1ca122cfaaff3f8b109554a29cc7a1132d13a0c6-1280x717.png`],
  ["projects/thought.png", `${sanity}/41a99c4ae85965e19dcc6befe7caaae6c2d54d9c-1146x644.png`],
  ["projects/jupiter.png", `${sanity}/bff6c9518d1b998df04c33101d61ad965fd23a98-1413x760.png`],
  ["projects/chromatik.png", `${sanity}/80de59a860bc12ff92d9d349ffe319cfb92a8de8-1258x984.png`],
  ["projects/digital-travel.png", `${sanity}/219c0768c852e48380fd831ed0772f7c173ac0ea-1280x719.png`],
  ["projects/mercedes-amg.png", `${sanity}/f430b963c80253937547780211cd3abe7b23924c-1920x1080.png`],
  ["projects/purity-revealed.png", `${sanity}/689cc8437a49fac1ba8f12012d73cf9d20ce46fb-3840x2160.png`],
];

async function download([file, url]) {
  const destination = join(out, file);
  await mkdir(dirname(destination), { recursive: true });
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  await writeFile(destination, Buffer.from(await response.arrayBuffer()));
  console.log(`downloaded ${file}`);
}

for (let index = 0; index < assets.length; index += 4) {
  await Promise.all(assets.slice(index, index + 4).map(download));
}

