"use server";

import { z } from "zod";
import fs from "fs/promises";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

const productSchema = z.object({
  photo: z.string({
    required_error: "Photo is required",
  }),
  title: z.string({
    required_error: "Title is required",
  }),
  description: z.string({
    required_error: "Description is required",
  }),
  price: z.coerce.number({
    required_error: "Price is required",
  }),
});

export async function uploadProduct(_: any, formData: FormData) {
  const data = {
    photo: formData.get("photo"),
    title: formData.get("title"),
    price: formData.get("price"),
    description: formData.get("description"),
  };
  
  // if (data.photo instanceof File) { // 로컬 서버에 파일 업로드   권장하지 않음
  //   const photoData = await data.photo.arrayBuffer();
  //   await fs.appendFile(`./public/${data.photo.name}`, Buffer.from(photoData));
  //   data.photo = `/${data.photo.name}`;
  // }

  const result = productSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const session = await getSession();
    if (session.id) {
      const product = await db.product.create({
        data: {
          title: result.data.title,
          description: result.data.description,
          price: result.data.price,
          photo: result.data.photo,
          user: {
            connect: {
              id: session.id,
            },
          },
        },
        select: { // 반환되는 product에 담기는 값
          id: true,
        },
      });

      console.log("product------")
      console.log(product.id)
      console.log(product)

      redirect(`/products/${product.id}`);
      //redirect("/products")
    }
  }
}


export async function getUploadUrl() {
  // const response = await fetch(
  //   `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`,
  //   {
  //     method: "POST",
  //     headers: {
  //       Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
  //     },
  //   }
  // );
  // const data = await response.json();
  // return data;

  return {
    result: {
      id: "2cdc28f0-017a-49c4-9ed7-87056c83901",
      uploadURL:
        "https://upload.imagedelivery.net/Vi7wi5KSItxGFsWRG2Us6Q/2cdc28f0-017a-49c4-9ed7-87056c83901",
    },
    result_info: null,
    success: true,
    errors: [],
    messages: [],
  };

}