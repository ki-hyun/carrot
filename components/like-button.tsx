"use client";

import { HandThumbUpIcon } from "@heroicons/react/24/solid";
import { HandThumbUpIcon as OutlineHandThumbUpIcon } from "@heroicons/react/24/outline";
import { startTransition, useOptimistic } from "react";
import { dislikePost, likePost } from "@/app/posts/[id]/actions";

interface LikeButtonProps {
  isLiked: boolean;
  likeCount: number;
  postId: number;
}

export default function LikeButton({
  isLiked,
  likeCount,
  postId,
}: LikeButtonProps) {
  const [state, reducerFn] = useOptimistic(
    { isLiked, likeCount },
    (previousState, payload:number) => ({
      isLiked: !previousState.isLiked,
      likeCount: previousState.isLiked ? previousState.likeCount - payload : previousState.likeCount + payload,
    })
  );
  const onClick = async () => {
    startTransition(async () => {
      reducerFn(555);
      if (isLiked) {
        await dislikePost(postId);
      } else {
        await likePost(postId);
      }
    });
  };
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 text-neutral-400 text-sm border border-neutral-400 rounded-full p-2  transition-colors ${
        state.isLiked
          ? "bg-orange-500 text-white border-orange-500"
          : "hover:bg-neutral-800"
      }`}
    >
      {state.isLiked ? (
        <HandThumbUpIcon className="size-5" />
      ) : (
        <OutlineHandThumbUpIcon className="size-5" />
      )}
      {state.isLiked ? (
        <span> {state.likeCount}</span>
      ) : (
        <span>공감하기 ({state.likeCount})</span>
      )}
    </button>
  );
}

// "use client";

// import { HandThumbUpIcon } from "@heroicons/react/24/solid";
// import { HandThumbUpIcon as OutlineHandThumbUpIcon } from "@heroicons/react/24/outline";
// import { useOptimistic, startTransition } from "react";
// import { dislikePost, likePost } from "@/app/posts/[id]/actions";

// interface LikeButtonProps {
//   isLiked: boolean;
//   likeCount: number;
//   postId: number;
// }

// export default function LikeButton({
//   isLiked,
//   likeCount,
//   postId,
// }: LikeButtonProps) {
//   const [state, reducerFn] = useOptimistic(
//     { isLiked, likeCount },
//     (previousState, payload:number) => ({
//       isLiked: !previousState.isLiked, 
//       likeCount: previousState.isLiked ? previousState.likeCount - payload : previousState.likeCount + payload,
//       // console.log(payload); 
//     })
//   );
//   const onClick = () => {
//     console.log("const onClick = () => {",state.isLiked)
      
//     startTransition(async () => {
//       reducerFn(1);
//       if (state.isLiked) {
//         await dislikePost(postId);
//       } else {
//         await likePost(postId);
//       }
//     });
//   };
//   return (
//     <button
//       onClick={onClick}
//       className={`flex items-center gap-2 text-neutral-400 text-sm border border-neutral-400 rounded-full p-2  transition-colors ${
//         state.isLiked
//           ? "bg-orange-500 text-white border-orange-500"
//           : "hover:bg-neutral-800"
//       }`}
//     >
//       {state.isLiked ? (
//         <HandThumbUpIcon className="size-5" />
//       ) : (
//         <OutlineHandThumbUpIcon className="size-5" />
//       )}
//       {state.isLiked ? (
//         <span> {state.likeCount}</span>
//       ) : (
//         <span>공감하기 ({state.likeCount})</span>
//       )}
//     </button>
//   );
// }