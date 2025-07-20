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



import ProductList from "@/components/product-list";
import db from "@/lib/db";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Prisma } from "@prisma/client";
import Link from "next/link";

async function getInitialProducts() {
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    take: 1,
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
  const initialProducts = await getInitialProducts();
  return (
    <div>
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