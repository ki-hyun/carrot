"use server";

import crypto from "crypto";
import { z } from "zod";
import validator from "validator";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { resourceLimits } from "worker_threads";

// const phoneSchema = z.string().trim().refine(validator.isMobilePhone);

const phoneSchema = z
  .string()
  .trim()
  .refine(
    (phone) => validator.isMobilePhone(phone, "ko-KR"),
    "Wrong phone format"
  );

// const tokenSchema = z.coerce.number().min(100000).max(999999);

async function tokenExists(token: number) {
  const exists = await db.sMSToken.findUnique({
    where: {
      token: token.toString(),
    },
    select: {
      id: true,
    },
  });
  return Boolean(exists);
}

const tokenSchema = z.coerce
  .number()
  .min(100000)
  .max(999999)
  .refine(tokenExists, "This token does not exist.");

interface ActionState {
  token: boolean;
}

async function getToken() {
  const token = crypto.randomInt(100000, 999999).toString();
  const exists = await db.sMSToken.findUnique({
    where: {
      token,
    },
    select: {
      id: true,
    },
  });
  if (exists) {
    return getToken();
  } else {
    return token;
  }
}



export async function smsLogIn(prevState: ActionState, formData: FormData) {
  const phone = formData.get("phone");
  const token = formData.get("token");
  if (!prevState.token) {// 전화번호 입력 화면
    const result = phoneSchema.safeParse(phone);
    
    if (!result.success) { // 제대로된 전화번호 아님

      console.log(result.error.flatten())

      const result11 = {
        formErrors: ['Wrong phone format'],
        fieldErrors: {},
      };

      console.log(result11)

      return {
        token: false,
        error: result.error.flatten(),
      };
    } else {
      await db.sMSToken.deleteMany({
        where: {
          user: {
            phone: result.data,
          },
        },
      });
      const token = await getToken();
      console.log("token:",token)
      await db.sMSToken.create({
        data: {
          token,
          user: {
            connectOrCreate: {
              where: {
                phone: result.data,
              },
              create: {
                username: crypto.randomBytes(10).toString("hex"),
                phone: result.data,
              },
            },
          },
        },
      });
      return {
        token: true,
      };
    }


  } else {
    const result = await tokenSchema.safeParseAsync(token);
    console.log("result==========================")
    console.log(result)

    if (!result.success) {
      return {
        token: true,
        error: result.error.flatten(),
      };
    } else {
      const token = await db.sMSToken.findUnique({
        where: {
          token: result.data.toString(),
        },
        select: {
          id: true,
          userId: true,
        },
      });
      if(token){ // 사실 필요없음   await tokenSchema.safeParseAsync(token); 코드로 토큰 확인했음
        const resulterrortoken = {
          formErrors: ['토큰 에러 안맞음'],
          fieldErrors: {},
        };
    
        return {
          token: true,
          error: resulterrortoken,
        };
      }

      const session = await getSession();
      session.id = token!.userId;
      await session.save();
      await db.sMSToken.delete({
        where: {
          id: token!.id,
        },
      });
      redirect("/profile");
    }
  }

  // 사용자들이 입력하지 않은 smstoken은 언제 없애지?
}