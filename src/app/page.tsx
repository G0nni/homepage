import Link from "next/link";
import Image from "next/image";

import { getServerAuthSession } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import { RealTimeHour } from "./_components/RealTimeHours";
import defaultImage from "../images/default.webp";

export default async function Home() {
  const session = await getServerAuthSession();

  const color1 = "#035d80";
  const color2 = "#aab9af";

  void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <main
        className={`flex min-h-screen items-center justify-center text-white`}
        style={{
          background: `linear-gradient(to bottom, ${color1}, ${color2})`,
        }}
      >
        <div className="flex flex-row gap-10">
          <div className="relative h-[600px] w-[350px] overflow-hidden rounded-md shadow-[0px_54px_55px_rgba(0,0,0,0.25),0px_-12px_30px_rgba(0,0,0,0.12),0px_4px_6px_rgba(0,0,0,0.12),0px_12px_13px_rgba(0,0,0,0.17),0px_-3px_5px_rgba(0,0,0,0.09)]">
            <Image
              src={defaultImage}
              alt="Default image"
              layout="fill"
              objectFit="cover"
            />
          </div>

          <div className="flex flex-col items-center gap-10 pt-5">
            <p className="text-sm">this place sure feels haunted...</p>
            <RealTimeHour />
            <form action="https://google.com/search" method="get">
              <input
                className="w-25rem md:w-30rem lg:w-30rem h-3rem rounded-md border-none bg-black bg-opacity-30 px-5 text-sm font-normal leading-normal text-white placeholder-white outline-none"
                type="text"
                name="q"
                placeholder="Rechercher sur Google"
                autoComplete="off"
                required
              />
            </form>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
{
  /* {session?.user && <LatestPost />}
  <div className="flex flex-col items-center justify-center gap-4">
              <p className="text-center text-2xl text-white">
                {session && <span>Logged in as {session.user?.name}</span>}
              </p>
              <Link
                href={session ? "/api/auth/signout" : "/api/auth/signin"}
                className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
              >
                {session ? "Sign out" : "Sign in"}
              </Link>
            </div> */
}
