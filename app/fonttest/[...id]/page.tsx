// export default function Extras() {
export default async function Extras({ params }: { params: Promise<{ id: string[] }> }) {

  // all segments
  // [[...id]] 이렇게 하면 옵셔널    추가 새그먼터 없이 /fonttest도 들어올수 있음
  const { id: idString } = await params;
  console.log(idString);

  return (
    <div className="flex flex-col gap-3 py-10">
      <h1 className="text-6xl rubick">Extras!</h1>
      <h1 className="text-6xl font-roboto">So much more to learn!</h1>
      <h1 className="text-6xl font-rubick">So much more to learn!</h1>
      <h1 className="text-6xl">So much more to learn!</h1>
    </div>
  );
}
