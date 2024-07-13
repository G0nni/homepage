import React from "react";

interface ModalAddLinkProps {
  setIsModalOpen: (isOpen: boolean) => void;
  handleAddLink: (e: React.FormEvent<HTMLFormElement>) => void;
  newLinkHref: string;
  setNewLinkHref: (href: string) => void;
  newLinkAlt: string;
  setNewLinkAlt: (alt: string) => void;
}

export function ModalAddLink({
  setIsModalOpen,
  handleAddLink,
  newLinkHref,
  setNewLinkHref,
  newLinkAlt,
  setNewLinkAlt,
}: ModalAddLinkProps) {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={() => setIsModalOpen(false)}>
          &times;
        </span>
        <form onSubmit={handleAddLink}>
          <label>
            Link URL:
            <input
              type="text"
              value={newLinkHref}
              onChange={(e) => setNewLinkHref(e.target.value)}
            />
          </label>
          <label>
            Link Alt Text:
            <input
              type="text"
              value={newLinkAlt}
              onChange={(e) => setNewLinkAlt(e.target.value)}
            />
          </label>
          <button type="submit">Add Link</button>
        </form>
      </div>
    </div>
  );
}
