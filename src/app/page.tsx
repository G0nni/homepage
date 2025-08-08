import { Dashboard } from "./_components/Dashboard";
import { getServerAuthSession } from "../server/auth";
import { db } from "../server/db";

export default async function Home() {
  const session = await getServerAuthSession();
  let initialLayout = undefined;
  if (session?.user?.id) {
    const config = await db.userConfig.findUnique({
      where: { userId: session.user.id },
      select: { layout: true },
    });
    if (config?.layout) {
      try {
        initialLayout = JSON.parse(config.layout);
      } catch {
        initialLayout = undefined;
      }
    }
  }
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800">
      <Dashboard initialLayout={initialLayout} />
    </main>
  );
}
