import { item } from "@prisma/client";
import React, { Dispatch, FC, SetStateAction, useState } from "react";
import Trpc from "../pages/api/trpc/[trpc]";
import { api } from "../utils/api";

interface NewItemModalProps {
  setItems: Dispatch<SetStateAction<item[]>>;
}

const NewItemModal: FC<NewItemModalProps> = ({ setItems }) => {
  const [input, setInput] = useState<string>("");

  const { mutate: addItem } = api.item.addItem.useMutation({
    onSuccess({ item }) {
      setItems((prev) => [...prev, item]);
    },
  });

  return (
    <div className="flex h-12 justify-between rounded-lg bg-gray-300 px-2 mt-2 focus-within:bg-white">
      <input
        className="bg-transparent w-full border-transparent focus:border-transparent focus:ring-0 outline-none"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Write a new Task"
      />
      <div className="flex justify-between items-center">
        <button
          className="rounded bg-blue-500 py-1 px-4 font-bold text-white hover:bg-blue-700"
          onClick={() => {addItem({ name: input }); setInput("")}}
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default NewItemModal;
