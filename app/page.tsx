import Link from "next/link";
import Image from "next/image";
import { SITE_NAME } from "./lib/config";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen overflow-hidden relative select-none">
      {/* --- Bottom text --- */}
      <h1 className="absolute bottom-2.5 right-2.5 text-xl">
        Yes, a parrot, why not?
      </h1>

      {/* --- Parrot photo --- */}
      <Image
        src="/parrot.png"
        alt="Parrot, why not?"
        className="absolute bottom-0 -right-50 -z-10"
        height={768}
        width={768}
      />

      {/* --- GBT (Giant Backdrop Texts) --- */}
      <h1
        className="absolute -top-100 -right-100 text-[40rem] font-bold text-transparent opacity-5 -z-15"
        style={{ WebkitTextStroke: "2px white" }}
      >
        {SITE_NAME}
      </h1>
      <h1
        className="absolute top-100 right-100 text-[40rem] font-bold text-transparent opacity-5 -z-15"
        style={{ WebkitTextStroke: "2px white" }}
      >
        {SITE_NAME}
      </h1>

      <div className="absolute right-0 -bottom-1/4 w-80 h-80 bg-white blur-[100px] opacity-5"></div>
      <div className="absolute left-0 -top-1/4 w-80 h-80 bg-white blur-[100px] opacity-5"></div>

      <h1 className="text-8xl font-bold bg-linear-to-t from-zinc-300 to-white bg-clip-text text-transparent">
        {SITE_NAME}
      </h1>

      <p className="mt-4 text-2xl text-center max-w-lg">
        A simple quiz builder where anyone can create and share quizzes — no
        login required.
      </p>

      <Link
        href="/quiz/create"
        className="mt-10 bg-white text-black text-xl px-8 py-2 rounded-full transition hover:opacity-90 cursor-pointer"
      >
        Get Started
      </Link>
    </div>
  );
}
