export default function Container1() {
  return (
    <div className="container1 flex h-full flex-col items-center justify-center gap-y-4 rounded-lg border-2 border-[#dee8ef] bg-[#fdfeff90] p-10">
      <img
        className=" max-h-48 rounded-lg border-2 transition-all duration-300 ease-in-out hover:scale-105"
        src="https://imgur.com/VcjNCtj.jpg"
        alt=""
      />
      <img
        className="max-h-72 rounded-lg border-2 transition-all duration-300 ease-in-out hover:scale-105"
        src="https://imgur.com/sWPovze.jpg"
        alt=""
      />
    </div>
  );
}
