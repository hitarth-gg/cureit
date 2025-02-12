export default function Card1({ title, text, link, linkName }) {
  return (
    <div className="card bg-[#ffffff90] z-10  flex select-none items-center justify-start space-x-7 rounded-lg border-2 border-[#dee8ef] px-2 py-2 md:px-5 md:py-3 transition-all duration-150 ease-in-out hover:border-[#55a6f6] hover:bg-[#ebf5fe50] backdrop-blur-md"
    >
      <div className="left">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="#4c5967"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 8.25V18a2.25 2.25 0 0 0 2.25 2.25h13.5A2.25 2.25 0 0 0 21 18V8.25m-18 0V6a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 6v2.25m-18 0h18M5.25 6h.008v.008H5.25V6ZM7.5 6h.008v.008H7.5V6Zm2.25 0h.008v.008H9.75V6Z"
          />
        </svg>
      </div>
      <div className="right max-w-lg space-y-1 text-left">
        <div className="title text-sm lg:text-base font-semibold text-[#131b20]">
          {title}
        </div>
        <div className="body text-xs text-[#4c5967] md:text-sm">{text}</div>
        <a
          href={link}
          className="body md:text-base text-xs font-semibold text-[#0959aa]"
        >
          {linkName}
        </a>
      </div>
    </div>
  );
}
