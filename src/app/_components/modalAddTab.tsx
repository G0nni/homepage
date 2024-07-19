"use client";

type ModalAddTabPropsType = {
  setIsModalOpen: (isOpen: boolean) => void;
  handleAddTab: (e: React.FormEvent<HTMLFormElement>) => void;
  newTabName: string;
  setNewTabName: (value: string) => void;
};

export function ModalAddTab({
  setIsModalOpen,
  handleAddTab,
  newTabName,
  setNewTabName,
}: ModalAddTabPropsType) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="mx-auto w-11/12 max-w-md rounded-lg bg-white p-6 shadow-lg">
        <form onSubmit={handleAddTab} className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Ajouter un nouvel Onglet
          </h3>
          <div>
            <label
              htmlFor="newTabName"
              className="block text-sm font-medium text-gray-700"
            >
              Nom de l&apos;onglet
            </label>
            <input
              type="text"
              id="newTabName"
              value={newTabName}
              onChange={(e) => setNewTabName(e.target.value)}
              placeholder="Nom de l'onglet"
              className="mt-1 block w-full rounded-md border-gray-300 text-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
