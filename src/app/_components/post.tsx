"use client";

import { useState, useEffect } from "react";
import { api } from "~/trpc/react";

type Session = {
  user: {
    id: string;
    [key: string]: any;
  };
  [key: string]: any;
};

interface SettingsModalProps {
  session: Session | null;
}

export function Post({ session }: SettingsModalProps) {
  const [post, setPost] = useState<{
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    createdById: string;
  } | null>(null);
  const utils = api.useUtils();
  const [name, setName] = useState("");

  // Assuming `useQuery` is the correct hook for non-Suspense fetching
  const { data: latestPost, error } = api.post.getLatest.useQuery(undefined, {
    enabled: !!session, // Only run the query if the session exists
  });

  useEffect(() => {
    if (latestPost) {
      setPost(latestPost);
      setName(latestPost.name);
    }
  }, [latestPost]);

  const createPost = api.post.create.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate();
      setName("");
    },
  });

  const updatePost = api.post.update.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate();
      setName("");
    },
  });

  const handlePost = () => {
    if (post) {
      updatePost.mutate({ id: post.id, name });
    } else {
      createPost.mutate({ name });
    }
  };

  if (!session) {
    return <p>Connectez-vous pour créer un post.</p>;
  }

  if (error) {
    console.error("Failed to fetch latest post:", error);
    return <p>Echec de la récupération de votre post.</p>;
  }

  return (
    <div className="w-full rounded-lg bg-white">
      <h3 className="text-normal mb-4 font-semibold text-gray-800">
        Postez votre phrase
      </h3>
      {post ? (
        <p className="truncate text-gray-700">Votre phase : {post.name}</p>
      ) : (
        <p className="text-gray-700">Vous n'avez pas encore posté de phrase.</p>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handlePost();
        }}
        className="mt-5"
      >
        <div>
          <input
            type="text"
            id="postTitle"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your title here"
            className="mt-1 block w-full rounded-md border-gray-300 text-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            type="submit"
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            disabled={createPost.isPending || updatePost.isPending}
          >
            {post ? "Mettre à jour" : "Ajouter"}
          </button>
        </div>
      </form>
    </div>
  );
}
