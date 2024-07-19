import React, { useState } from "react";

interface ContextMenuProps {
  x: number;
  y: number;
  type: "tab" | "link" | null;
  target: string | null;
  onClose: () => void;
  onEdit: (newName: string, newAlt: string) => void;
  onDelete: () => void;
}

export function ContextMenu({
  x,
  y,
  type,
  target,
  onClose,
  onEdit,
  onDelete,
}: ContextMenuProps) {
  // séparer target en récupérant les valeurs séparées par une virgule
  const entryName = target?.split(",")[0];
  const entryAlt = target?.split(",")[1];

  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState(entryName ?? "");
  const [newAlt, setNewAlt] = useState(entryAlt ?? "");
  const typeInFrench = type === "tab" ? "onglet" : "lien";

  const handleEdit = () => {
    onEdit(newName, newAlt);
    setEditMode(false);
    onClose();
  };

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  return (
    <div
      className="absolute z-50 rounded-md bg-white p-2 shadow-lg"
      style={{ top: y, left: x }}
      onClick={(e) => e.stopPropagation()}
    >
      {!editMode ? (
        <>
          <button
            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setEditMode(true)}
          >
            Editer {typeInFrench}
          </button>
          <button
            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
            onClick={handleDelete}
          >
            Supprimer {typeInFrench}
          </button>
        </>
      ) : (
        <div className="flex flex-col">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="mb-2 rounded-md border px-2 py-1 text-gray-700"
          />
          {type === "link" && (
            <input
              type="text"
              value={newAlt}
              onChange={(e) => setNewAlt(e.target.value)}
              className="mb-2 rounded-md border px-2 py-1 text-gray-700"
              placeholder="Texte alternatif"
            />
          )}

          <button
            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
            onClick={handleEdit}
          >
            Sauvegarder
          </button>
        </div>
      )}
    </div>
  );
}
