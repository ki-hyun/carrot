export default function Home() {
  return (
    // 크기에 따라 색 변경
    <main className="bg-gray-100 sm:bg-red-100 md:bg-green-100 lg:bg-cyan-100 xl:bg-orange-100 2xl:bg-purple-100 h-screen flex flex-col items-center justify-center p-5 gap-10">
      
      <div className="bg-white shadow-lg p-5 rounded-3xl w-full max-w-screen-sm flex flex-col gap-4">Add commentMore actions
        {["Nico", "Me", "You", "Yourself", ""].map((person, index) => (
          <div key={index} className="flex items-center gap-5 pd-5 border-b-2 last:border-0">
            <div className="size-10 bg-blue-400 rounded-full" />
            <span className="text-lg font-medium empty:w-24 empty:h-5 empty:rounded-full empty:animate-pulse empty:bg-gray-300">
              {person}
            </span>
            <div className="size-6 bg-red-500 text-white animate-bounce flex items-center justify-center rounded-full relative">
              <span className="z-10">{index}</span>
              <div className="size-6 bg-red-500 rounded-full absolute animate-ping " />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white shadow-lg p-5 rounded-3xl w-full max-w-screen-sm flex flex-col gap-4">Add commentMore actions
        {["Nico", "Me", "You", "Yourself", ""].map((person, index) => (
          <div key={index} className="flex items-center group gap-5 pd-5 border-b-2 last:border-0">
            <div className="size-10 bg-blue-400 rounded-full" />
            <span className="text-lg font-medium group-hover:text-red-500 empty:w-24 empty:h-5 empty:rounded-full empty:animate-pulse empty:bg-gray-300">
              {person}
            </span>
            <div className="size-6 bg-red-500 text-white animate-bounce flex items-center justify-center rounded-full relative">
              <span className="z-10">{index}</span>
              <div className="size-6 bg-red-500 rounded-full absolute animate-ping " />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white shadow-lg p-5 rounded-3xl w-full max-w-screen-sm flex flex-col gap-4">
        <div className="group flex flex-col">Add commentMore actions
          <input
            className="bg-gray-100 w-full"
            placeholder="Write your email"
          />
          <span className="group-focus-within:block hidden">
            Make sure it is a valid email...
          </span>
          <button>Submit</button>
        </div>
      </div>

    </main>
  );
}