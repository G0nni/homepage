import Link from "next/link";

import { getServerAuthSession } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import { RealTimeHour } from "./_components/RealTimeHours";
import { Tabs } from "./_components/tabs";
import { SettingsModal } from "./_components/settingsModal";
import { ImageContainer } from "./_components/imageContainer";
import { BackgroundGradient } from "./_components/backgroundGradient";
import { SearchBar } from "./_components/searchbar";
import { SyncModule } from "./_components/syncModule";
type Session = {
  user: {
    id: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

type userPost = {
  id: number;
  name: string;
  public: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
};

export default async function Home() {
  const session: Session | null =
    (await getServerAuthSession()) as Session | null;

  const randomPost = await api.post.getRandom();
  const userPost: userPost =
    (await api.post.getLatest()) as unknown as userPost;

  return (
    <HydrateClient>
      <BackgroundGradient />
      <SyncModule session={session} />
      <main
        className={`flex min-h-screen items-start justify-center text-white md:items-center lg:items-center`}
      >
        <div className="absolute right-5 top-5 flex items-center gap-4">
          <p className="text-normal text-center text-white">
            {session && <span>Bienvenue {session.user?.name as string} !</span>}
          </p>
          {!session && (
            <Link
              href="/api/auth/signin"
              className="rounded-md bg-white/10 px-5 py-3 font-semibold no-underline transition hover:bg-white/20"
            >
              Se connecter
            </Link>
          )}

          <SettingsModal session={session} />
        </div>
        <div className="flex flex-row gap-10">
          <ImageContainer />
          <div className="flex w-25rem flex-col gap-2 md:w-30rem lg:w-30rem">
            <div className="flex flex-col items-center gap-10 pt-44 md:pt-5 lg:pt-5">
              {userPost ? (
                !userPost.public ? (
                  <p className="text-sm">{userPost.name}</p>
                ) : randomPost ? (
                  <p className="text-sm">{randomPost.name}</p>
                ) : (
                  <p className="text-sm">Bienvenue !</p>
                )
              ) : (
                <p className="text-sm">Bienvenue !</p>
              )}
              <RealTimeHour />
              <SearchBar />
            </div>
            <Tabs />
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
