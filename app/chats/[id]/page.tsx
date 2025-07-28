import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound } from "next/navigation";

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
  if (room) {
    const session = await getSession();
    const canSee = Boolean(room.users.find((user) => user.id === session.id!));
    if (!canSee) {
      return null;
    }
  }
  return room;
}

// export default async function ChatRoom({ params }: { params: { id: string } }) {
export default async function ChatRoom({ params }: { params: Promise<{ id: string }> }) {

  const { id: idString } = await params;
  // const id = Number(idString);

  const room = await getRoom(idString);
  if (!room) {
    return notFound();
  }
  return <h1>chat!</h1>;
}