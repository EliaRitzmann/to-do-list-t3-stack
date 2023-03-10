import { item } from "@prisma/client";
import { type NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import NewItemModal from "../components/NewItemModal";

import { api } from "../utils/api";

const Home: NextPage = () => {
  const [items, setItems] = useState<item[]>([]);

  const { data: itemsData, isLoading } = api.item.getAllItems.useQuery();

  const { mutate: deleteItem } = api.item.deleteItem.useMutation({
    onSuccess(item) {
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    },
  });

  const { mutate: checkItem } = api.item.checkItem.useMutation({
    onSuccess(item) {
      //replace updated item
      const updatedArray = items.map((i) => {
        if (i.id === item.id) {
          return item;
        }
        return i;
      });

      setItems(updatedArray);
    },
  });

  useEffect(() => {
    if (itemsData) {
      setItems(itemsData);
      console.log("database read");
    }
  }, [itemsData]);

  if (!items || isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Head>
        <title>To do List</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      

      <main className="h-screen bg-slate-200 ">
        <div className="mx-auto max-w-3xl py-12">
          <div className="flex justify-between">
            <h1 className="text-2xl font-semibold">To do List:</h1>
            
          </div>

          <ul className="mt-2">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between rounded-lg bg-white h-12 mt-2 px-2"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() =>
                      checkItem({ id: item.id, checked: !item.checked })
                    }
                    className={
                      "h-6 w-6  rounded-md border-none bg-stone-200 focus:ring-0 focus:ring-offset-0"
                    }
                  />
                  {item.checked ? (
                    <span
                      className="select-none font-semibold line-through"
                      onClick={() =>
                        checkItem({ id: item.id, checked: !item.checked })
                      }
                    >
                      {item.name}
                    </span>
                  ) : (
                    <span
                      className=" select-none font-semibold"
                      onClick={() =>
                        checkItem({ id: item.id, checked: !item.checked })
                      }
                    >
                      {item.name}
                    </span>
                  )}
                </div>

                <button
                  className="rounded bg-red-500 py-1 px-4 font-bold text-white hover:bg-red-700"
                  onClick={() => deleteItem({ id: item.id })}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
          <NewItemModal
          setItems={setItems}
        ></NewItemModal>
        </div>
      </main>
    </>
  );
};

export default Home;
