import { formatToTimeAgo, formatToWon } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface ListProductProps {
  title: string;
  price: number;
  created_at: Date;
  photo: string;
  id: number;
}

export default function ListProduct({
  title,
  price,
  created_at,
  photo,
  id,
}: ListProductProps) {
  return (
    <Link href={`/products/${id}`} className="flex gap-5">
      <div className="relative size-28 rounded-md overflow-hidden">
        {/* <Image fill src={photo} alt={title} /> */}
        {/* <Image
          fill
          src={`${photo}/avatar`}
          className="object-cover"
          alt={title}
        /> */}
        <img src={photo} alt={title} className="w-full h-full object-cover absolute top-0 left-0"/>
      </div>
      <div className="flex flex-col gap-1 *:text-white">
        <span className="text-lg">{title}</span>
        <span className="text-sm text-neutral-500">
          {/* {created_at.toString()} */}
          {formatToTimeAgo(created_at.toString())}
        </span>
        {/* <span className="text-lg font-semibold">{price}</span> */}
        <span className="text-lg font-semibold">{formatToWon(price)}원</span>
      </div>
    </Link>
  );
}