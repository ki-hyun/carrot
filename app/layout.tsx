import type { Metadata } from "next";
// import { Geist, Geist_Mono, Inter } from "next/font/google";
import { Inter } from "next/font/google";
import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Karrot Market",
    default: "Karrot Market",
  },
  description: "Sell and buy all the things!",
};

// 방법 2: 타입을 확장하여 potato prop 허용
interface CustomLayoutProps {
  children: React.ReactNode;
  potato: React.ReactNode;
}

export default function RootLayout(props: CustomLayoutProps) {
  const { children, potato } = props;

  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-neutral-900 text-white max-w-screen-sm mx-auto`}
      >
        {potato}
        {children}
      </body>
    </html>
  );
}

// export default function RootLayout({
//   children,
//   //@ts-ignore
//   potato
// }: Readonly<CustomLayoutProps>) {
// // }: Readonly<{
// //   children: React.ReactNode;
// // }>) {
//   // console.log(potato);
//   return (
//     <html lang="en">
//       <body
//         className={`${inter.className} bg-neutral-900 text-white max-w-screen-sm mx-auto`}
//       >
//         {potato}
//         {children}
//       </body>
//     </html>

//     // <html lang="en">
//     //   <body
//     //     className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//     //   >
//     //     {children}
//     //   </body>
//     // </html>
//   );
// }


