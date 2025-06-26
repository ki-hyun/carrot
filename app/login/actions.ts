"use server";

// import { redirect } from "next/navigation";

// export async function handleForm(prevState: any, formData: FormData) {
//   console.log("prevstate:",prevState);
  
//   // email 값 추출
//   // const email = formData.get('email');
//   // console.log("Email:", email);

//   // FormData의 모든 키-값 쌍 출력
//   console.log("=== FormData 모든 필드 ===");
//   for (const [key, value] of formData.entries()) {
//     console.log(`${key}: ${value}`);
//   }
//   console.log("=======================");

//   await new Promise((resolve) => setTimeout(resolve, 1000));

//   // redirect("/")

//   return {
//     errors: ["wrong password", "password too short"],
//   };
// }


import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constants";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(PASSWORD_MIN_LENGTH)
    .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
});

export async function logIn(prevState: any, formData: FormData) {
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };
  const result = formSchema.safeParse(data);
  if (!result.success) {
    console.log(result.error.flatten());
    return result.error.flatten();
  } else {
    console.log(result.data);
  }
}