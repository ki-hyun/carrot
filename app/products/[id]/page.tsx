import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToWon } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import { notFound, redirect } from "next/navigation";
import { unstable_cache, revalidateTag } from "next/cache";

// import Image from "next/image";

//// 이 함수 쓰면 정적 빌드하라고 요청함
//// static 으로 빌드하려고 할때 미리 list 받아오기
// export async function generateStaticParams() {
//   const products = await db.product.findMany({
//     select: {
//       id: true,
//     },
//   });
//   return products.map((product) => ({ id: product.id + "" }));
// }

////// 더 이상 동적 페이지 만들지 않음  미리 빌드안되어있는 페이지 호출시 404
// export const dynamicParams = false;


// async function wait() {
//   await new Promise((resolve) => setTimeout(resolve, 2000));
// }

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

const createChatRoom = async (productUserId: number) => {
  "use server";
  const session = await getSession();

  console.log(productUserId,session.id)

  const room = await db.ChatRoom.create({
    data: {
      users: {
        connect: [
          { id: productUserId, }, { id: session.id, },
        ],
      },
    },
    select: {
      id: true,
    },
  });
  redirect(`/chats/${room.id}`);
};

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

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {

  const { id: idString } = await params;
  const id = Number(idString);

  const product = await getCachedProductTitle(id);
  return {
    title: product?.title,
  };
}

// export default async function Products({
//   params,
// }: {
//   params: { id: string };
// }) {
  
export default async function Products({ params }: { params: Promise<{ id: string }> }) {
  // await wait();

  const { id: idString } = await params;
  const id = Number(idString);

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
        {/* <Link
          className="bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold"
          href={``}
        >
          채팅하기
        </Link> */}
        <form action={createChatRoom.bind(null, product.userId)}>
          <button className="bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold">
            채팅하기
          </button>
        </form>
      </div>
    </div>
  );
}