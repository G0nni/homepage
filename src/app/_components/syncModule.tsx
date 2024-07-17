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

type userConfig = {
  autoThemeEnabled: boolean;
  tabs: string;
  themeImage: string;
  searchEngine: string;
  topColor: string;
  bottomColor: string;
  darkVibrant: string;
  lightVibrant: string;
};

interface SyncModuleProps {
  session: Session | null;
}

export function SyncModule({ session }: SyncModuleProps) {
  const [userConfig, setUserConfig] = useState<userConfig | null>(null);

  const createConfig = api.userConfig.create.useMutation({
    onSuccess: async () => {
      console.log("creation success");
    },
  });
  const updateConfig = api.userConfig.update.useMutation({
    onSuccess: async () => {
      console.log("update success");
    },
  });

  useEffect(() => {
    const SyncStorageCheck = () => {
      if (session) {
        console.log("SyncStorageCheck");
        const autoThemeEnabled = localStorage.getItem("autoThemeEnabled");
        const tabs = localStorage.getItem("tabs");
        const themeImage = localStorage.getItem("themeImage");
        const searchEngine = localStorage.getItem("searchEngine");
        const topColor = localStorage.getItem("topColor");
        const bottomColor = localStorage.getItem("bottomColor");
        const darkVibrant = localStorage.getItem("darkVibrant");
        console.log("darkVibrant", darkVibrant);
        const lightVibrant = localStorage.getItem("lightVibrant");
        console.log("lightVibrant", lightVibrant);

        setUserConfig({
          autoThemeEnabled: autoThemeEnabled
            ? JSON.parse(autoThemeEnabled)
            : false,
          tabs: tabs ? tabs : "",
          themeImage: themeImage ? themeImage : "",
          searchEngine: searchEngine ? searchEngine : "",
          topColor: topColor ? topColor : "",
          bottomColor: bottomColor ? bottomColor : "",
          darkVibrant: darkVibrant ? darkVibrant : "",
          lightVibrant: lightVibrant ? lightVibrant : "",
        });
      } else {
        console.log("SyncStorageCheck: No session");
      }
    };

    SyncStorageCheck();

    window.addEventListener("storage", SyncStorageCheck);

    return () => {
      window.removeEventListener("storage", SyncStorageCheck);
    };
  }, [session]);

  useEffect(() => {
    if (userConfig !== null) {
      handleSync();
    }
  }, [userConfig]);

  const handleSync = () => {
    console.log(userConfig);
  };

  return (
    <div>
      <h1>SyncModule</h1>
      <div>
        <h2>userConfig</h2>
        <pre>{JSON.stringify(userConfig, null, 2)}</pre>
      </div>
    </div>
  );
}
