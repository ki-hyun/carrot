import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound } from "next/navigation";
import ChatMessagesList from "@/components/chat-messages-list";
import { Prisma } from "@prisma/client";

async function getRoom(id: string) {
  const room = await db.chatRoom.findUnique({
    where: {
      id,
    },
    include: {
      users: {
        select: { id: true },
      },
    },
  });
  // console.log("getRoom------",room)
  if (room) {
    const session = await getSession();
    const canSee = Boolean(room.users.find((user) => user.id === session.id!));
    if (!canSee) {
      return null;
    }
  }
  return room;
}

async function getMessages(chatRoomId: string) {
  const messages = await db.message.findMany({
    where: {
      chatRoomId,
    },
    select: {
      id: true,
      payload: true,
      created_at: true,
      userId: true,
      user: {
        select: {
          avatar: true,
          username: true,
        },
      },
    },
  });
  return messages;
}

async function getUserProfile() {
  const session = await getSession();
  const user = await db.user.findUnique({
    where: {
      id: session.id!,
    },
    select: {
      username: true,
      avatar: true,
    },
  });
  return user;
}

export type InitialChatMessages = Prisma.PromiseReturnType<typeof getMessages>;

// export default async function ChatRoom({ params }: { params: { id: string } }) {
export default async function ChatRoom({ params }: { params: Promise<{ id: string }> }) {

  const { id: idString } = await params;
  // const id = Number(idString);

  // console.log("export default async function ChatRoom({ params }: { params: Promise<{ id: string }> }) {",idString)

  const room = await getRoom(idString);
  if (!room) {
    return notFound();
  }
  const user = await getUserProfile();
  if (!user) {
    return notFound();
  }

  const initialMessages = await getMessages(idString);
  const session = await getSession();

  console.log("ChatRoom",room)

  return (
    <ChatMessagesList chatRoomId={idString} userId={session.id!} initialMessages={initialMessages} username={user.username} avatar={user.avatar!}/>
  );
}