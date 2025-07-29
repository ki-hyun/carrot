"use client";

import { InitialChatMessages } from "@/app/chats/[id]/page";
import { saveMessage } from "@/app/chats/actions";
import { formatToTimeAgo } from "@/lib/utils";
import { ArrowUpCircleIcon } from "@heroicons/react/24/solid";
import { RealtimeChannel, createClient } from "@supabase/supabase-js";
import { useEffect, useRef, useState } from "react";

const SUPABASE_PUBLIC_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0YmtuZnhrYm1xYmtzbmxzcmlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2OTI3NzMsImV4cCI6MjA2OTI2ODc3M30.M_0OD1ukJXDsfZUEWqIib7nyGZZFxw3lJoJ-f2tXWbY"
const SUPABASE_URL = "https://ytbknfxkbmqbksnlsrij.supabase.co";

//FIXME - 채팅방 입장이 잘 안됨  여러번 눌러야 입장 됨 체크 필요


interface ChatMessageListProps {
  initialMessages: InitialChatMessages;
  userId: number;
  chatRoomId: string;
  username: string;
  avatar: string;
}
export default function ChatMessagesList({
  initialMessages,
  userId,
  chatRoomId,
  username,
  avatar,
}: ChatMessageListProps) {

  // console.log("ChatMessagesList({")

  const [messages, setMessages] = useState(initialMessages);
  const [message, setMessage] = useState("");
  // const channel = useRef<RealtimeChannel>();
  const channel = useRef<RealtimeChannel | null>(null);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setMessage(value);
  };
  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // console.log(process.env.SUPABASE_URL, process.env.SUPABASE_PUBLIC_KEY)
    // alert(process.env.SUPABASE_URL);
    // alert(process.env.GITHUB_CLIENT_ID);
    
    console.log("const onSubmit")

    setMessages((prevMsgs) => [
      ...prevMsgs,
      {
        id: Date.now(),
        payload: message,
        created_at: new Date(),
        userId,
        user: {
          username: "string",
          avatar: "xxx",
        },
      },
    ]);
    // console.log(channel.current?)

    // if (channel.current) {
    //   console.log("currnet 존재",channel.current)
    // }

    if (channel.current) {
      console.log("채널 URL:", channel.current.socket?.endPoint);
      console.log("채널 topic:", channel.current.topic);
      console.log("채널 상태:", channel.current.state);
      
      channel.current.send({
        type: "broadcast",
        event: "message",
        payload: {
          id: Date.now(),
          payload: message,
          created_at: new Date(),
          userId,
          user: {
            username,
            avatar,
          },
        },
      }).then(() => {
        console.log("메시지 전송 성공:", message);
      }).catch((error) => {
        console.error("메시지 전송 실패:", error);
      });
    } else {
      console.error("채널이 연결되지 않았습니다!");
    }
    await saveMessage(message, chatRoomId);
    setMessage("");
  };
  useEffect(() => {
    console.log("  useEffect(() => { -------------------------",chatRoomId)
    // console.log(SUPABASE_URL)
    // console.log(SUPABASE_PUBLIC_KEY)

    const client = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
    // channel.current = client.channel(`room-${chatRoomId}`);
    channel.current = client.channel(`asdf`);
    channel.current
      .on("broadcast", { event: "message" }, (payload) => {
        // console.log("브로드캐스트 메시지 수신:", payload);

        setMessages((prevMsgs) => [...prevMsgs, payload.payload]);
      })
      .on("presence", { event: "sync" }, () => {
        const presenceState = channel.current?.presenceState();
        console.log("현재 접속 인원:", presenceState);
        console.log("접속자 수:", Object.keys(presenceState || {}).length);
      })
      .on("presence", { event: "join" }, ({ key, newPresences }) => {
        console.log("새로운 사용자 입장:", key, newPresences);
      })
      .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
        console.log("사용자 퇴장:", key, leftPresences);
      })
      .subscribe(async (status) => {
        console.log("채널 구독 상태:", status);
        if (status === "SUBSCRIBED") {
          // 현재 사용자를 presence에 추가
          await channel.current?.track({
            user_id: userId,
            online_at: new Date().toISOString(),
          });
        }
      });
    return () => {
      channel.current?.unsubscribe();
    };

    // const channel = client.channel(`room-${chatRoomId}`);
    // channel.on("broadcast", { event: "message" }, (payload) => {
    //   console.log("channel.on+++++++++++++++++++++++++++++++++++++++++++++",payload);
    //   // console.log("useEffect(() => {---------------------------------------------")
    // });

    // // return () => {
    // //   channel.unsubscribe();
    // // };
  }, [chatRoomId]);
  return (
    <div className="p-5 flex flex-col gap-5 min-h-screen justify-end">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex gap-2 items-start ${
            message.userId === userId ? "justify-end" : ""
          }`}
        >
          {message.userId === userId ? null : (
            <img
              src={message.user.avatar!}
              alt={message.user.username}
              width={50}
              height={50}
              className="size-8 rounded-full"
            />
          )}
          <div
            className={`flex flex-col gap-1 ${ message.userId === userId ? "items-end" : ""}`}
          >
            <span
              className={`${message.userId === userId ? "bg-neutral-500" : "bg-orange-500"} p-2.5 rounded-md`}
            >
              {message.payload}
            </span>
            <span className="text-xs">
              {formatToTimeAgo(message.created_at.toString())}
            </span>
          </div>
        </div>
      ))}
      <form className="flex relative" onSubmit={onSubmit}>
        <input
          required
          onChange={onChange}
          value={message}
          className="bg-transparent rounded-full w-full h-10 focus:outline-none px-5 ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-neutral-50 border-none placeholder:text-neutral-400"
          type="text"
          name="message"
          placeholder="Write a message..."
        />
        <button className="absolute right-0">
          <ArrowUpCircleIcon className="size-10 text-orange-500 transition-colors hover:text-orange-300" />
        </button>
      </form>
    </div>
  );
}