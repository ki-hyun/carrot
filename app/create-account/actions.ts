"use server";
import { z } from "zod";
import bcrypt from "bcrypt";

import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constants";
import db from "@/lib/db";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import getSession from "@/lib/session";


// const passwordRegex = new RegExp(
//   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[#?!@$%^&*-]).+$/
// );

const passwordRegex = new RegExp(
  /^(?=.*[a-z]).+$/
);

const checkUniqueUsername = async (username: string) => {
  const user = await db.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
    },
  });
  // if (user) {
  //   return false;
  // } else {
  //   return true;
  // }
  return !Boolean(user);
};

const checkUniqueEmail = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });
  return Boolean(user) === false;
};

const formSchema = z.object({
  username: z.string({
    invalid_type_error: "Username must be a string!",
    required_error: "Where is my username???",
    })
    // .min(3, "Way too short!!!")
    // .max(10, "That is too looooong!")
    .trim()
    .toLowerCase()
    // .transform((username) => `🔥 ${username}`)    // 변환
    .refine(
      (username) => !username.includes("potato"),
      "No potatoes allowed!"
    )
    .refine(checkUniqueUsername, "아이디 이미 있음"),
  email: z.string().email().toLowerCase()
    .refine(checkUniqueEmail, "이메일 이미 있음"),
  password: z.string().min(3).regex(
    passwordRegex,
    "Passwords must contain at least one UPPERCASE, lowercase, number and special characters #?!@$%^&*-"
  ),
  confirm_password: z.string().min(3),
})
.superRefine(({ password, confirm_password }, ctx) => {
  if (password !== confirm_password) {
    ctx.addIssue({
      code: "custom",
      message: "Two passwords should be equal",
      path: ["confirm_password"],
    });
  }
});

export async function createAccount(prevState: any, formData: FormData) {
  console.log("createAccount")

  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
  };

  console.log("입력된 데이터:", data);

  // const result = formSchema.safeParse(data);
  const result = await formSchema.safeParseAsync(data);  
  if (!result.success) {
    console.log("=== Zod 에러 상세 정보 ===");
    console.log("에러 메시지:", result.error.message);
    console.log("에러 코드:", result.error.issues);
    console.log("========================");

    console.log(result.error.flatten())

    // return {
    //   errors: result.error.flatten(),
    //   values: data, // 입력값도 함께 반환
    // };

    return result.error.flatten();
    
  } else {// 계정 만들기
    console.log("result-------------------------------------------");
    console.log(result);
    // console.log(cookies());

    const hashedPassword = await bcrypt.hash(result.data.password, 11);
    // console.log(hashedPassword)
    const user = await db.user.create({
      data: {
        username: result.data.username,
        email: result.data.email,
        password: hashedPassword,
      },
      select: {
        id: true,
      },
    });


    const session = await getSession();
    session.id = user.id;
    await session.save();

    console.log("session------------------------------------------");
    console.log(session)

    redirect("/profile")

  }

  // 에러나옴
  // if (data.password !== data.confirm_password) {
  //   return {
  //     errors: {
  //       username: [],
  //       email: [],
  //       password: [],
  //       confirm_password: ["비밀번호가 일치하지 않습니다."]
  //     }
  //   };
  // }
  
  console.log("okok login")
}