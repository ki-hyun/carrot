


import { revalidatePath } from "next/cache";

async function getData() {
  const data = await fetch(
    "https://nomad-movies.nomadcoders.workers.dev/movies"
  );

  // 따로 데이터를 저장 안해서 fetch 캐싱되지 않음
}

export default async function Extras() {
  await getData();
  const action = async () => {
    "use server";
    revalidatePath("/fonttest");
  };
  return (
    <div className="flex flex-col gap-3 py-10">
      <h1 className="text-6xl font-metallica">Extras!</h1>
      <h2 className="font-roboto">So much more to learn!</h2>
      <form action={action}>
        <button>revalidate</button>
      </form>
  </div>
  );
}









// export default function Extras() {
//   return (
//     <div className="flex flex-col gap-3 py-10">
//       <h1 className="text-6xl font-metallica">Extras!</h1>
//       <h1 className="text-6xl font-roboto">So much more to learn!</h1>
//       <h1 className="text-6xl font-rubick">So much more to learn!</h1>
//       <h1 className="text-6xl">So much more to learn!</h1>
//     </div>
//   );
// }
