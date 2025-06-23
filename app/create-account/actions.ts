"use server";
import { z } from "zod";

const passwordRegex = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[#?!@$%^&*-]).+$/
);

const formSchema = z.object({
  username: z.string({
    invalid_type_error: "Username must be a string!",
    required_error: "Where is my username???",
    })
    .min(3, "Way too short!!!")
    .max(10, "That is too looooong!")
    .trim()
    .toLowerCase()
    // .transform((username) => `🔥 ${username}`)    // 변환
    .refine(
      (username) => !username.includes("potato"),
      "No potatoes allowed!"
    ),
  email: z.string().email().toLowerCase(),
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

  // console.log("입력된 데이터:", data);

  const result = formSchema.safeParse(data);
  if (!result.success) {
    console.log("=== Zod 에러 상세 정보 ===");
    console.log("에러 메시지:", result.error.message);
    console.log("에러 코드:", result.error.issues);
    console.log("========================");

    console.log(result.error.flatten())

    return result.error.flatten();
  } else {
    console.log(result.data);
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