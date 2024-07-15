import Link from "next/link";
import Image from "next/image";

import { getServerAuthSession } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import { RealTimeHour } from "./_components/RealTimeHours";
import { Tabs } from "./_components/tabs";
import { SettingsModal } from "./_components/settingsModal";
import { ImageContainer } from "./_components/imageContainer";
import { BackgroundGradient } from "./_components/backgroundGradient";

export default async function Home() {
  const session = await getServerAuthSession();

  const color1 = "#035d80";
  const color2 = "#aab9af";

  return (
    <HydrateClient>
      <BackgroundGradient />
      <main
        className={`flex min-h-screen items-start justify-center text-white md:items-center lg:items-center`}
        // style={{
        //   background: `linear-gradient(to bottom, ${color1}, ${color2})`,
        // }}
      >
        <div className="absolute right-5 top-5 flex items-center gap-4">
          <p className="text-normal text-center text-white">
            {session && <span>Bienvenue {session.user?.name} !</span>}
          </p>
          <Link
            href={session ? "/api/auth/signout" : "/api/auth/signin"}
            className="rounded-md bg-white/10 px-5 py-3 font-semibold no-underline transition hover:bg-white/20"
          >
            {session ? "Se déconnecter" : "Se connecter"}
          </Link>
          <SettingsModal />
        </div>
        <div className="flex flex-row gap-10">
          <ImageContainer />
          <div className="flex w-25rem flex-col gap-2 md:w-30rem lg:w-30rem">
            <div className="flex flex-col items-center gap-10 pt-44 md:pt-5 lg:pt-5">
              <p className="text-sm">this place sure feels haunted...</p>
              <RealTimeHour />
              <form action="https://google.com/search" method="get">
                <input
                  className="h-3rem w-25rem rounded-md border-none bg-black bg-opacity-30 px-5 text-sm font-normal leading-normal text-white placeholder-white outline-none md:w-30rem lg:w-30rem"
                  type="text"
                  name="q"
                  placeholder="Rechercher sur Google"
                  autoComplete="off"
                  required
                />
              </form>
            </div>
            <Tabs />
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
