import React, { useState } from "react";

interface ContextMenuProps {
  x: number;
  y: number;
  type: "tab" | "link" | null;
  target: string | null;
  onClose: () => void;
  onEdit: (newName: string) => void;
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
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState(target || "");

  const handleEdit = () => {
    onEdit(newName);
    setEditMode(false);
    onClose();
  };

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  return (
    <div
      className="absolute rounded-md bg-white p-2 shadow-lg"
      style={{ top: y, left: x }}
      onClick={(e) => e.stopPropagation()}
    >
      {!editMode ? (
        <>
          <button
            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setEditMode(true)}
          >
            Edit {type}
          </button>
          <button
            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
            onClick={handleDelete}
          >
            Delete {type}
          </button>
        </>
      ) : (
        <div className="flex flex-col">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="mb-2 rounded-md border px-2 py-1"
          />
          <button
            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
            onClick={handleEdit}
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}
