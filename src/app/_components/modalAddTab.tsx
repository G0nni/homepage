import React from "react";

interface ModalAddTabProps {
  setIsModalOpen: (isOpen: boolean) => void;
  handleAddTab: () => void;
  newTabName: string;
  setNewTabName: (name: string) => void;
}

export function ModalAddTab({
  setIsModalOpen,
  handleAddTab,
  newTabName,
  setNewTabName,
}: ModalAddTabProps) {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={() => setIsModalOpen(false)}>
          &times;
        </span>
        <form onSubmit={(e) => e.preventDefault()}>
          <label>
            Tab Name:
            <input
              type="text"
              value={newTabName}
              onChange={(e) => setNewTabName(e.target.value)}
            />
          </label>
          <button type="button" onClick={handleAddTab}>
            Add Tab
          </button>
        </form>
      </div>
    </div>
  );
}
