import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToWon } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { unstable_cache, revalidateTag } from "next/cache";

async function wait() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
}

async function getIsOwner(userId: number) {
  const session = await getSession();
  if (session.id) {
    return session.id === userId;
  }
  return false;
}

async function getProduct(id: number) {
  console.log("product +++++");
  const product = await db.product.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });
  return product;
}

const getCachedProduct = unstable_cache(getProduct, ["product-detail"], {
  tags: ["product-detail", "xxxx"],
});

async function getProductTitle(id: number) {
  console.log("getProductTitle +++++");
  const product = await db.product.findUnique({
    where: {
      id,
    },
    select: {
      title: true,
    },
  });
  return product;
}

const getCachedProductTitle = unstable_cache(getProductTitle, ["product-title"], {
  tags: ["product-title", "xxxx"],
});

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getCachedProductTitle(Number(params.id));
  return {
    title: product?.title,
  };
}

export default async function ProductDetail({
  params,
}: {
  params: { id: string };
}) {
  
  // await wait();

  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }
  const product = await getCachedProduct(id);
  if (!product) {
    return notFound();
  }

  // console.log("product===========================")
  // console.log(product)

  const isOwner = await getIsOwner(product.userId);
  const revalidate = async () => {
    "use server";
    revalidateTag("xxxx");
  };
  return (
    <div>
      <div className="relative aspect-square">
        {/* <Image fill src={product.photo} alt={product.title} /> */}
        {/* <Image
          className="object-cover"
          fill
          src={`${product.photo}/public`}
          alt={product.title}
        /> */}
        {/* <img src={product.photo} alt={product.title} className="w-full h-full object-cover absolute top-0 left-0"/> */}
        <img src={product.photo} alt={product.title} className=""/>
        
      </div>
      <div className="p-5 flex items-center gap-3 border-b border-neutral-700">
        {/* <div className="size-10 rounded-full"> */}
        <div className="size-10 overflow-hidden rounded-full">
          {product.user.avatar !== null ? (
            // <Image
            //   src={product.user.avatar}
            //   width={40}
            //   height={40}
            //   alt={product.user.username}
            // />
            <img
              src={product.user.avatar}
              width={40}
              height={40}
              alt={product.user.username}
            />
          ) : (
            <UserIcon />
          )}
        </div>
        <div>
          <h3>{product.user.username}</h3>
        </div>
      </div>
      <div className="p-5">
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <p>{product.description}</p>
      </div>

      <form action={revalidate}>
        <button className="bg-green-500 px-5 py-2.5 rounded-md text-white font-semibold">
          Revalidate title cache
        </button>
      </form>

      <div className="fixed w-full bottom-0 left-0 p-5 pb-10 bg-neutral-800 flex justify-between items-center">
        <span className="font-semibold text-xl">
          {formatToWon(product.price)}원
        </span>
        {isOwner ? (
          <button className="bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold">
            Delete product
          </button>
        ) : null}
        <Link
          className="bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold"
          href={``}
        >
          채팅하기
        </Link>
      </div>
    </div>
  );
}