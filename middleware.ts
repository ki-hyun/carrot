import { NextRequest, NextResponse } from "next/server";
import getSession from "./lib/session";

interface Routes {
  [key: string]: boolean;
}

const publicOnlyUrls: Routes = {
  "/": true,
  "/login": true,
  "/sms": true,
  "/create-account": true,
  "/github/start": true,
  "/github/complete": true,
};

export async function middleware(request: NextRequest) {
  
  // const session = await getSession();

  // const exists = publicOnlyUrls[request.nextUrl.pathname];
  // if (!session.id) {///// 로그아웃상태
  //   if (!exists) { ////////// 로그아웃 상태인데   앱내 컨텐츠로 이동할 경우
  //     return NextResponse.redirect(new URL("/", request.url));
  //   }
  // } else {
  //   if (exists) { /////////// 로그인인 상태인데 로그인전 상황으로 가려고 할 경우
  //     return NextResponse.redirect(new URL("/products", request.url));
  //   }
  // }

  // console.log("middleware-----------------------------------------------")
  // console.log(request.nextUrl.pathname)
  // console.log(session);

  // // if (request.nextUrl.pathname === "/profile") {
  // //   return NextResponse.redirect(new URL("/", request.url));
  // //   // return Response.json({
  // //   //   error:" you are not allowed here!",
  // //   // })
  // // }

}

export const config = {
  // matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};