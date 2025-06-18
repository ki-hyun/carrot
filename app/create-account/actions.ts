"use server";
import { z } from "zod";

const formSchema = z.object({
  username: z.string().min(3).max(10),
  email: z.string().email(),
  password: z.string().min(10),
  confirm_password: z.string().min(10),
});

export async function createAccount(prevState: any, formData: FormData) {
  console.log("createAccount")

  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
  };

  // console.log("입력된 데이터:", data);

  const result = formSchema.safeParse(data);
  if (!result.success) {
    console.log("=== Zod 에러 상세 정보 ===");
    console.log("에러 메시지:", result.error.message);
    console.log("에러 코드:", result.error.issues);
    console.log("========================");

    console.log(result.error.flatten())
    
    return result.error.flatten();
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