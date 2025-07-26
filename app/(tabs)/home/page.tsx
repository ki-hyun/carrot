import ProductList from "@/components/product-list";
import db from "@/lib/db";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Prisma } from "@prisma/client";
import { unstable_cache, revalidatePath  } from "next/cache";
import Link from "next/link";

// 페이지 캐싱 방법 설정
export const dynamic = "force-dynamic";
// force-dynamic 강제로 dynamic
// export const revalidate = 60;     // 캐싱 이후 60초 지나면 재검증

// //// fetch 자동 캐쉬됨
// fetch("http://api.com",{
//   next:{
//     revalidate: 50 // 50초 후에 호출하면 다시 캐싱
//   }
// })








const getCachedProducts = unstable_cache(getInitialProducts, ["home-products"], {revalidate: 60,}); // 60 초 지나서 호출하면 다시 캐싱
// const getCachedProducts = unstable_cache(getInitialProducts, ["home-products"]);

async function getInitialProducts() {
  console.log("hit ------- getInitialProducts()")
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    // take: 1,
    orderBy: {
      created_at: "desc",
    },
  });
  return products;
}

export type InitialProducts = Prisma.PromiseReturnType<
  typeof getInitialProducts
>;

export default async function Products() {
  // const initialProducts = await getInitialProducts();
  const initialProducts = await getCachedProducts();

  const revalidate = async () => {
    "use server";
    revalidatePath("/home"); // 이 주소 실행할때 연결된 모든 캐시 새로 고침
  };

  return (
    <div>
      <form action={revalidate}>
        <button>Revalidate</button>
      </form>
      <ProductList initialProducts={initialProducts} />
      <Link
        href="/products/add"
        className="bg-orange-500 flex items-center justify-center rounded-full size-16 fixed bottom-24 right-8 text-white transition-colors hover:bg-orange-400"
      >
        <PlusIcon className="size-10" />
      </Link>
      <Link
        href="/products/addcloud"
        className="bg-yellow-500 flex items-center justify-center rounded-full size-16 fixed bottom-44 right-8 text-white transition-colors hover:bg-yellow-400"
      >
        <PlusIcon className="size-10" />
      </Link>
    </div>
  );
}












// import db from "@/lib/db";
// import getSession from "@/lib/session";
// import { notFound, redirect } from "next/navigation";
// import ListProduct from "@/components/list-product";


// async function getUser() {
//   const session = await getSession();

//   console.log("session-------------------------------------------------------\n",session)

//   if (session.id) {
//     const user = await db.user.findUnique({
//       where: {
//         id: session.id,
//       },
//     });
//     if (user) {
//       return user;
//     }
//   }
//   notFound();
// }

// async function getProducts() {
//   // await new Promise((resolve) => setTimeout(resolve, 3000));

//   const products = await db.product.findMany({
//     select: {
//       title: true,
//       price: true,
//       created_at: true,
//       photo: true,
//       id: true,
//     },
//   });
//   return products;

// }

// export default async function Products() {
//   const products = await getProducts();
  
//   const user = await getUser();
//   const logOut = async () => {
//     "use server";
//     const session = await getSession();
//     await session.destroy();
//     redirect("/");
//   };
//   return (
//     <div>
//       <h1>Product {user?.username}</h1>
//       <form action={logOut}>
//         <button>Log out</button>
//       </form>

//       <div className="p-5 flex flex-col gap-5">
//       {products.map((product) => (
//         <ListProduct key={product.id} {...product} />
//       ))}
//       </div>
//     </div>
//   );
// }