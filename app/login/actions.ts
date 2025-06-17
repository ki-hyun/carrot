"use server";

import { redirect } from "next/navigation";

export async function handleForm(prevState: any, formData: FormData) {
  console.log("prevstate:",prevState);
  
  // email 값 추출
  // const email = formData.get('email');
  // console.log("Email:", email);

  // FormData의 모든 키-값 쌍 출력
  console.log("=== FormData 모든 필드 ===");
  for (const [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }
  console.log("=======================");

  await new Promise((resolve) => setTimeout(resolve, 1000));

  // redirect("/")

  return {
    errors: ["wrong password", "password too short"],
  };
}