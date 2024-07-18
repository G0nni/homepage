"use client";
import React, { useState, useEffect } from "react";
import { api } from "~/trpc/react";

type Session = {
  user: {
    id: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

type UserConfig = {
  autoThemeEnabled: boolean | null;
  tabs: string | null;
  themeImage: string | null;
  searchEngine: string | null;
  topColor: string | null;
  bottomColor: string | null;
  darkVibrant: string | null;
  lightVibrant: string | null;
  userId: string | null;
};

interface SyncModuleProps {
  session: Session | null;
}

export function SyncModule({ session }: SyncModuleProps) {
  const [userConfig, setUserConfig] = useState<UserConfig | null>(null);
  const [serverUserConfig, setServerUserConfig] = useState<UserConfig | null>(
    null,
  );

  const createConfig = api.userConfig.create.useMutation({
    onSuccess: () => {
      console.log("Creation success");
      // Après la création réussie, vous pouvez refetch les données si nécessaire
      void fetchServerConfig.refetch();
    },
  });

  const updateConfig = api.userConfig.update.useMutation({
    onSuccess: () => {
      console.log("Update success");
      // Après la mise à jour réussie, vous pouvez refetch les données si nécessaire
      void fetchServerConfig.refetch();
    },
  });

  const fetchServerConfig = api.userConfig.getByUserId.useQuery(
    { userId: session?.user.id ?? "" },
    { enabled: !!session?.user.id },
  );

  useEffect(() => {
    if (fetchServerConfig.data) {
      setServerUserConfig(fetchServerConfig.data);
      // Synchroniser les données du serveur vers le local storage si nécessaire
      syncServerToLocalStorage(fetchServerConfig.data);
    }
  }, [fetchServerConfig.data]);

  useEffect(() => {
    const syncStorageCheck = () => {
      if (session) {
        const autoThemeEnabled = localStorage.getItem("autoThemeEnabled");
        const tabs = localStorage.getItem("tabs");
        const themeImage = localStorage.getItem("themeImage");
        const searchEngine = localStorage.getItem("searchEngine");
        const topColor = localStorage.getItem("topColor");
        const bottomColor = localStorage.getItem("bottomColor");
        const darkVibrant = localStorage.getItem("darkVibrant");
        const lightVibrant = localStorage.getItem("lightVibrant");

        setUserConfig({
          userId: session.user.id,
          autoThemeEnabled: autoThemeEnabled
            ? (JSON.parse(autoThemeEnabled) as boolean)
            : false,
          tabs: tabs ?? "",
          themeImage: themeImage ?? "",
          searchEngine: searchEngine ?? "",
          topColor: topColor ?? "",
          bottomColor: bottomColor ?? "",
          darkVibrant: darkVibrant ?? "",
          lightVibrant: lightVibrant ?? "",
        });
      }
    };

    syncStorageCheck();
    window.addEventListener("storage", syncStorageCheck);

    return () => {
      window.removeEventListener("storage", syncStorageCheck);
    };
  }, [session]);

  useEffect(() => {
    if (userConfig !== null) {
      handleSync();
    }
  }, [userConfig]);

  const handleSync = () => {
    if (session && userConfig) {
      if (serverUserConfig) {
        // Comparer les configurations locales et serveur et mettre à jour si nécessaire
        if (
          userConfig.autoThemeEnabled !== serverUserConfig.autoThemeEnabled ||
          userConfig.tabs !== serverUserConfig.tabs ||
          userConfig.themeImage !== serverUserConfig.themeImage ||
          userConfig.searchEngine !== serverUserConfig.searchEngine ||
          userConfig.topColor !== serverUserConfig.topColor ||
          userConfig.bottomColor !== serverUserConfig.bottomColor ||
          userConfig.darkVibrant !== serverUserConfig.darkVibrant ||
          userConfig.lightVibrant !== serverUserConfig.lightVibrant
        ) {
          updateConfig.mutate({
            userId: session.user.id,
            autoThemeEnabled: userConfig.autoThemeEnabled ?? undefined,
            tabs: userConfig.tabs ?? undefined,
            themeImage: userConfig.themeImage ?? undefined,
            searchEngine: userConfig.searchEngine ?? undefined,
            topColor: userConfig.topColor ?? undefined,
            bottomColor: userConfig.bottomColor ?? undefined,
            darkVibrant: userConfig.darkVibrant ?? undefined,
            lightVibrant: userConfig.lightVibrant ?? undefined,
          });
        }
      } else {
        // Créer une nouvelle configuration si aucune n'existe côté serveur
        createConfig.mutate({
          autoThemeEnabled: userConfig.autoThemeEnabled ?? undefined,
          tabs: userConfig.tabs ?? undefined,
          themeImage: userConfig.themeImage ?? undefined,
          searchEngine: userConfig.searchEngine ?? undefined,
          topColor: userConfig.topColor ?? undefined,
          bottomColor: userConfig.bottomColor ?? undefined,
          darkVibrant: userConfig.darkVibrant ?? undefined,
          lightVibrant: userConfig.lightVibrant ?? undefined,
        });
      }
    }
  };

  const syncServerToLocalStorage = (config: UserConfig) => {
    if (!session || !config) return;
    localStorage.setItem(
      "autoThemeEnabled",
      JSON.stringify(config.autoThemeEnabled),
    );
    localStorage.setItem("tabs", config.tabs ?? "");
    localStorage.setItem("themeImage", config.themeImage ?? "");
    localStorage.setItem("searchEngine", config.searchEngine ?? "");
    localStorage.setItem("topColor", config.topColor ?? "");
    localStorage.setItem("bottomColor", config.bottomColor ?? "");
    localStorage.setItem("darkVibrant", config.darkVibrant ?? "");
    localStorage.setItem("lightVibrant", config.lightVibrant ?? "");
  };

  return <></>;
}
