"use client";
import React, { useEffect, useRef, useState } from "react";
import GridLayout, { Layout } from "react-grid-layout";
import { RealTimeHour } from "./RealTimeHours";
import { SearchBar } from "./searchbar";
import { ImageContainer } from "./imageContainer";
import { Tabs } from "./tabs";
import { useSession } from "next-auth/react";
import { api } from "../../trpc/react";

const defaultLayout: Layout[] = [
  { i: "hour", x: 0, y: 0, w: 2, h: 2 },
  { i: "search", x: 2, y: 0, w: 4, h: 2 },
  { i: "image", x: 0, y: 2, w: 6, h: 4 },
];
const LAYOUT_KEY = "homepage_layout";

export const Dashboard = ({
  editMode: editModeProp,
  initialLayout,
}: {
  editMode?: boolean;
  initialLayout?: Layout[];
}) => {
  const { data: session } = useSession();
  const [layout, setLayout] = useState<Layout[]>(
    initialLayout ?? defaultLayout,
  );
  const [activeTab, setActiveTab] = useState<string>("Home");
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(900);

  // Responsive: observe la largeur du conteneur
  useEffect(() => {
    function updateWidth() {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    }
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(editModeProp ?? false);
  const getLayout = api.userConfig.getLayout.useQuery(undefined, {
    enabled: !!session?.user?.id && !initialLayout,
  });
  const setLayoutMutation = api.userConfig.setLayout.useMutation();

  useEffect(() => {
    // Si pas de layout initial, on hydrate depuis tRPC ou localStorage
    if (!initialLayout) {
      setLoading(true);
      if (session?.user?.id) {
        if (getLayout.isSuccess && getLayout.data?.layout) {
          setLayout(JSON.parse(getLayout.data.layout));
          setLoading(false);
        } else if (getLayout.isSuccess) {
          setLayout(defaultLayout);
          setLoading(false);
        } else if (getLayout.isError) {
          setLayout(defaultLayout);
          setLoading(false);
        }
      } else {
        const saved = localStorage.getItem(LAYOUT_KEY);
        if (saved) {
          setLayout(JSON.parse(saved));
        } else {
          setLayout(defaultLayout);
        }
        setLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    session?.user?.id,
    getLayout.isSuccess,
    getLayout.data,
    getLayout.isError,
  ]);

  const onLayoutChange = async (newLayout: Layout[]) => {
    setLayout(newLayout);
    if (session?.user?.id) {
      await setLayoutMutation.mutateAsync({
        layout: JSON.stringify(newLayout),
      });
    } else {
      localStorage.setItem(LAYOUT_KEY, JSON.stringify(newLayout));
    }
  };

  if (loading) return <div>Chargement du dashboard...</div>;

  return (
    <div
      ref={containerRef}
      className="flex h-screen w-full flex-col bg-transparent px-0"
    >
      {/* Barre d'action en haut à droite */}
      <div className="flex w-full items-center justify-end gap-2 p-4">
        {/* Bouton paramètres */}
        <button className="rounded-full p-2 text-inherit transition hover:bg-white/20">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path
              d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7Z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        </button>
        {/* Bouton connexion */}
        <button className="rounded bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700">
          Se connecter
        </button>
        {/* Bouton mode édition */}
        <button
          className={`ml-2 rounded px-4 py-2 font-semibold transition ${editMode ? "bg-blue-600 text-white" : "bg-white/10 text-white hover:bg-white/20"}`}
          onClick={() => setEditMode((v) => !v)}
        >
          {editMode ? "Quitter le mode édition" : "Gérer le visuel"}
        </button>
      </div>
      {/* Zone de widgets = zone de contenu, largeur 100% */}
      <div className="h-full w-full flex-1">
        <GridLayout
          className="layout"
          layout={layout}
          cols={12}
          rowHeight={Math.max(
            Math.floor((containerRef.current?.offsetHeight ?? 800) / 6),
            60,
          )}
          width={containerWidth}
          autoSize={true}
          onLayoutChange={editMode ? (l) => onLayoutChange(l) : undefined}
          isDraggable={editMode}
          isResizable={editMode}
          draggableHandle=".widget-header"
        >
          {/* Tabs comme widget déplaçable */}
          <div
            key="tabs"
            className="flex w-full min-w-0 flex-col rounded bg-white/10 p-0"
          >
            <div className="widget-header mb-2 cursor-move px-4 pt-2 font-bold">
              Favoris
            </div>
            <div className="w-full min-w-0 px-4 pb-2">
              <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
          </div>
          <div
            key="hour"
            className="flex w-full min-w-0 flex-col rounded bg-white/10 p-0"
          >
            <div className="widget-header mb-2 cursor-move px-4 pt-2 font-bold">
              Heure
            </div>
            <div className="flex w-full min-w-0 items-center px-4 pb-2">
              <RealTimeHour />
            </div>
          </div>
          <div
            key="search"
            className="flex w-full min-w-0 flex-col rounded bg-white/10 p-0"
          >
            <div className="widget-header mb-2 cursor-move px-4 pt-2 font-bold">
              Recherche
            </div>
            <div className="flex w-full min-w-0 items-center px-4 pb-2">
              <SearchBar />
            </div>
          </div>
          <div
            key="image"
            className="flex w-full min-w-0 flex-col rounded bg-white/10 p-0"
            style={{ overflow: "hidden" }}
          >
            <div className="widget-header mb-2 cursor-move px-4 pt-2 font-bold">
              Image
            </div>
            <div className="flex w-full min-w-0 items-center justify-center px-4 pb-2">
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ImageContainer />
              </div>
            </div>
          </div>
        </GridLayout>
      </div>
    </div>
  );

  if (loading) return <div>Chargement du dashboard...</div>;

  return (
    <div
      ref={containerRef}
      className="flex h-screen w-full flex-col bg-transparent px-0"
    >
      <button
        className={`mb-4 ml-4 mt-4 w-fit rounded px-4 py-2 font-semibold transition ${editMode ? "bg-blue-600 text-white" : "bg-white/10 text-white hover:bg-white/20"}`}
        onClick={() => setEditMode((v) => !v)}
      >
        {editMode ? "Quitter le mode édition" : "Gérer le visuel"}
      </button>
      <div className="h-full w-full flex-1">
        <GridLayout
          className="layout"
          layout={layout}
          cols={6}
          rowHeight={Math.max(
            Math.floor((containerRef.current?.offsetHeight ?? 800) / 6),
            80,
          )}
          width={containerWidth}
          onLayoutChange={editMode ? (l) => onLayoutChange(l) : undefined}
          isDraggable={editMode}
          isResizable={editMode}
          draggableHandle=".widget-header"
        >
          <div key="hour" className="rounded bg-white/10 p-2">
            <div className="widget-header mb-2 cursor-move font-bold">
              Heure
            </div>
            <RealTimeHour />
          </div>
          <div key="search" className="rounded bg-white/10 p-2">
            <div className="widget-header mb-2 cursor-move font-bold">
              Recherche
            </div>
            <SearchBar />
          </div>
          <div
            key="image"
            className="flex h-full max-h-[400px] min-h-[120px] flex-col items-center justify-center rounded bg-white/10 p-2"
            style={{ overflow: "hidden" }}
          >
            <div className="widget-header mb-2 cursor-move font-bold">
              Image
            </div>
            <div className="flex h-full w-full items-center justify-center">
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  maxHeight: 320,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ImageContainer />
              </div>
            </div>
          </div>
        </GridLayout>
      </div>
    </div>
  );
};

export default Dashboard;
