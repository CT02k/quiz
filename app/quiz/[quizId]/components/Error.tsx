import Link from "next/link";

export const Error = ({ message }: { message: string }) => (
  <div className="flex flex-col h-screen items-center justify-center">
    <p className="font-semibold text-2xl">Error: {message}</p>
    <Link
      className="px-4 py-1.5 bg-zinc-100 text-black rounded-lg mt-4 transition hover:opacity-90"
      href="/"
    >
      Go home
    </Link>
  </div>
);
