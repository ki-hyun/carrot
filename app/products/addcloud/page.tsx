"use client";

// 11.4 강의 여기부터 체크

import Button from "@/components/form-btn";
import Input from "@/components/form-input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { getUploadUrl, uploadProduct } from "./actions";
import { useActionState } from "react";

export default function AddProduct() {
  const [preview, setPreview] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [photoId, setImageId] = useState("");

  // const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;
    if (!files) {
      return;
    }
    const file = files[0];
    const url = URL.createObjectURL(file);
    setPreview(url);

    const { success, result } = await getUploadUrl();
    if (success) {

      console.log('------------------------------\n',result)

      const { id, uploadURL } = result;
      setUploadUrl(uploadURL);
      setImageId(id);
    }
  };
  // const [state, action] = useActionState(uploadProduct, null);

  const interceptAction = async (_: any, formData: FormData) => {
    // const file = formData.get("photo");
    // if (!file) {
    //   return;
    // }
    // const cloudflareForm = new FormData();
    // cloudflareForm.append("file", file);
    // const response = await fetch(uploadUrl, {
    //   method: "post",
    //   body: cloudflareForm,
    // });
    // console.log(await response.text());
    // if (response.status !== 200) {
    //   return;
    // }
    // const photoUrl = `https://imagedelivery.net/aSbksvJjax-AUC7qVnaC4A/${photoId}`;
    // formData.set("photo", photoUrl);
    // return uploadProduct(_, formData);

    const photoUrl = `https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQ3Hv6iGG5mrI76aruo7gRz7BTVzMs1SV2wo6hi-ohzY7bF6bxFCYLTqNsCO8GdB8jt2lHehNqcpDfRNYEJ-utWtQ`;
    formData.set("photo", photoUrl);
    return uploadProduct(_, formData);
  };
  const [state, action] = useActionState(interceptAction, null);

  return (
    <div>
      <form action={action} className="p-5 flex flex-col gap-5">
        <label
          htmlFor="photo"
          className="border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover"
          style={{
            backgroundImage: `url(${preview})`,
          }}
        >
          {preview === "" ? (
            <>
              <PhotoIcon className="w-20" />
              <div className="text-neutral-400 text-sm">
                사진을 추가해주세요.
                {state?.fieldErrors.photo}
              </div>
            </>
          ) : null}
        </label>
        <input
          onChange={onImageChange}
          type="file"
          id="photo"
          name="photo"
          accept="image/*"
          className="hidden"
        />
        <Input
          name="title"
          required
          placeholder="제목"
          type="text"
          errors={state?.fieldErrors.title}
        />
        <Input
          name="price"
          type="number"
          required
          placeholder="가격"
          errors={state?.fieldErrors.price}
        />
        <Input
          name="description"
          type="text"
          required
          placeholder="자세한 설명"
          errors={state?.fieldErrors.description}
        />
        <Button text="작성 완료" />
      </form>
    </div>
  );
}