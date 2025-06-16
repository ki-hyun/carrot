export default function Home() {
  return (
    // 크기에 따라 색 변경
    <main className="bg-gray-100 sm:bg-red-100 md:bg-green-100 lg:bg-cyan-100 xl:bg-orange-100 2xl:bg-purple-100 h-screen flex flex-col items-center justify-center p-5 gap-10">
    
    {/* md:flex-row */}
    <div className="bg-white shadow-lg p-5 rounded-3xl w-full max-w-screen-sm flex flex-col md:flex-row gap-2">
      <input
        className="w-full rounded-full h-10 bg-gray-200 pl-5 outline-none ring ring-transparent focus:ring-orange-500 focus:ring-offset-2 transition-shadow placeholder:drop-shadow"
        type="text"
        placeholder="Search here..."
      />
      <button className="bg-black text-white py-2 rounded-full active:scale-90  transition-transform font-medium outline-none md:px-10">
        Search
      </button>
    </div>

    {/* Add commentMore actions */}
    <div className="bg-white shadow-lg p-5 rounded-3xl w-full max-w-screen-md flex flex-col md:flex-row gap-2">
        <input
          className="w-full rounded-full h-10 bg-gray-200 pl-5 outline-none ring ring-transparent focus:ring-green-500 focus:ring-offset-2 transition-shadow placeholder:drop-shadow invalid:focus:ring-red-500 peer"
          type="email"
          required
          placeholder="Email address"
        />
        <span className="text-red-500 font-medium hidden peer-invalid:block ">
          Email is required.
        </span>
        <button className="text-white py-2 rounded-full active:scale-90  transition-transform font-medium outline-none md:px-10 bg-black ">
          Log in
        </button>
    </div>

    <div className="bg-white shadow-lg p-5 rounded-3xl w-full max-w-screen-sm flex flex-col md:flex-row gap-2 *:outline-none ring ring-transparent transition-shadow
      has-[:invalid]:ring-yellow-500 has-[:invalid]:bg-red-100">
        <input
          className="w-full rounded-full h-10 bg-gray-200 pl-5 ring ring-transparent focus:ring-green-500 focus:ring-offset-2 transition-shadow placeholder:drop-shadow invalid:focus:ring-red-500 peer"
          type="text"
          required
          placeholder="Email address"
        />
        <span className="text-red-500 font-medium hidden peer-invalid:block ">
          Email is required.
        </span>
        <button className="text-white py-2 rounded-full active:scale-90  transition-transform font-medium  md:px-10 bg-black ">
          Log in
        </button>
    </div>

    </main>
  );
}