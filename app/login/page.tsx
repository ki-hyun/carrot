import FormButton from "@/components/form-btn";
import FormInput from "@/components/form-input";
import SocialLogin from "@/components/social-login";

async function handleForm(formData: FormData) {
  "use server";

  await new Promise((resolve) => setTimeout(resolve, 2000));
  console.log("email:",formData.get("email"), "password:",formData.get("password"));
}

export default function LogIn() {
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">Log in with email and password.</h2>
      </div>
      <form action={handleForm} className="flex flex-col gap-3">
        <FormInput
          name="email"
          type="email"
          placeholder="Email"
          required
          errors={[]}
        />
        <FormInput
          name="password"
          type="password"
          placeholder="Password"
          required
          errors={[]}
        />
        {/* <FormButton loading={false} text="Log in" /> */}
        <FormButton text="Log in" />
      </form>
      <SocialLogin />
    </div>
  );
}