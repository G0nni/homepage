"use client";

import { useState, useEffect } from "react";
import { api } from "~/trpc/react";

type Session = {
  user: {
    id: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
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
  const [logMessage, setLogMessage] = useState<string | null>(null);

  // Assuming `useQuery` is the correct hook for non-Suspense fetching
  const { data: latestPost, error } = api.post.getLatest.useQuery(undefined, {
    enabled: !!session, // Only run the query if the session exists
    retry: false,
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

  const deletePost = api.post.delete.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate();
      setName("");
      setPost(null);
    },
  });

  const handlePost = () => {
    if (!name.trim()) {
      // Vous pouvez ajouter une logique ici pour afficher un message d'erreur si nécessaire
      setLogMessage("Votre phrase ne peut pas être vide.");
      return; // Sortie anticipée de la fonction si name est vide
    }
    if (post) {
      updatePost.mutate({ id: post.id, name });
      setLogMessage(null);
    } else {
      createPost.mutate({ name });
      setLogMessage(null);
    }
  };

  const handleDeletePost = () => {
    if (post) {
      deletePost.mutate({ id: post.id });
      setLogMessage(null);
      setName("");
    }
  };

  if (!session) {
    return <p>Connectez-vous pour créer un post.</p>;
  }

  return (
    <div className="w-full rounded-lg bg-white">
      <h3 className="text-normal mb-4 font-semibold text-gray-800">
        Postez votre phrase
      </h3>
      {post ? (
        <p className="text-gray-700">Votre phase : {post.name}</p>
      ) : (
        <p className="text-gray-700">
          Vous n&apos;avez pas encore posté de phrase.
        </p>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handlePost();
        }}
        className="mt-5"
      >
        <div>
          <textarea
            id="postTitle"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your title here"
            className="mt-1 block w-full rounded-md border-gray-300 text-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          {logMessage && (
            <p className="text-sm font-semibold text-red-500">{logMessage}</p>
          )}
          {post && (
            <button
              type="button"
              className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              onClick={() => handleDeletePost()}
            >
              Supprimer
            </button>
          )}

          <button
            type="submit"
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            disabled={
              createPost.isPending ||
              updatePost.isPending ||
              !!(post && name === post.name)
            }
          >
            {post ? "Mettre à jour" : "Ajouter"}
          </button>
        </div>
      </form>
    </div>
  );
}
