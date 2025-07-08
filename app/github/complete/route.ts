import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    return notFound();
  }
  const accessTokenParams = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    code,
  }).toString();
  
  const accessTokenURL = `https://github.com/login/oauth/access_token?${accessTokenParams}`;
  console.log(accessTokenURL)

  const accessTokenResponse = await fetch(accessTokenURL, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  });
  // const accessTokenData = await accessTokenResponse.json();
  const { error, access_token } = await accessTokenResponse.json();
  if (error) {
    return new Response(null, {
      status: 400,
    });
  }
  console.log("access_token:\n",access_token)

  const userProfileResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: "no-cache",
  });

  // const _userProfileResponse = await userProfileResponse.json();
  const { id, avatar_url, login } = await userProfileResponse.json();

  const user = await db.user.findUnique({
    where: {
      github_id: id + "", // id가 숫자형이기 때문에 "" 룰 추가해서 문자열로 변환
    },
    select: {
      id: true,
    },
  });

  if (user) { // 이미 등록되어 있을경우
    const session = await getSession();
    session.id = user.id;
    await session.save();
    return redirect("/profile");
  }

  // 혹시 이메일로 가입된 아이디 중에 중복 username 있는지 확인
  const newUser = await db.user.create({ // 새로운 유저 등록
    data: {
      username: login,
      github_id: id + "",
      avatar: avatar_url,
    },
    select: {
      id: true,
    },
  });
  const session = await getSession();
  session.id = newUser.id;
  await session.save();
  return redirect("/profile");

  // return Response.json({ _userProfileResponse });
}

// http://localhost:3000/github/complete?code=b80e64d22acd6ef7bfb1