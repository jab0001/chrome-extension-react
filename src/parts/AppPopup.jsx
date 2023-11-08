/// <reference types="chrome"/>

import { useEffect, useState } from "react";
import { ShopItem } from "../components/ShopItem";
import { StoreDataPopup } from "../components/StoreDataPopup";

import classNames from "../utils/classTransform";
import { getItems } from "../utils/itemsWorkground";
import * as Sentry from "@sentry/react";


export default function App() {
  const [items, setItems] = useState(null);

  const [busy, setBusy] = useState(false);

  const getItem = async () => {
    if (busy) return;

    const { totalPrise, newItem } = await getItems();

    if (totalPrise)
      setItems([
        ...((items && items.filter((i) => i.url != newItem.url)) || []),
        newItem,
      ]);
    else console.log("todo: add flashing message about empty stuff");
  };

  const processToPlatform = async () => {
    setBusy(true);
    if (items === null || !items?.length) return;

    await chrome.runtime.sendMessage({
      message: "process_to_platform",
      items: JSON.stringify({ items }),
    });

    if (!chrome.runtime.lastError) setItems();

    setBusy(false);
  };

  useEffect(() => {
    if (items === null) return;
    chrome.runtime.sendMessage(
      { message: "store_cart", state: JSON.stringify(items || []) },
      ({ message, error }) => {
        Sentry.captureException({ message, error });
      }
    );
  }, [items]);

  useEffect(() => {
    chrome.runtime.sendMessage(
      { message: "retrieve_cart" },
      ({ state, error }) => {
          setItems(JSON.parse(state));
      }
    );
  }, []);

  return (
    <div className={classNames("container p-2")} style={"width: 400px; max-height: 60vh"}>
      <StoreDataPopup />
      <h1 className={classNames("p-3 text-xl font-bold text-gray-800")}>Корзина</h1>
      <div className={classNames("flex flex-row gap-2 items-center justify-center")}>
        <button
          className={
            classNames("p-2 rounded-md w-full " + (!busy ? "bg-yellow-400" : "bg-gray-400"))
          }
          onClick={getItem}
        >
          Добавить со страницы
        </button>
        <button
          className={
            classNames("p-2 rounded-md w-full " + (!busy ? "bg-yellow-400" : "bg-gray-400"))
          }
          onClick={() => setItems([])}
        >
          Очистить
        </button>
      </div>
      {items?.length > 0 && (
        <button
          className={
            classNames("my-2 p-2 rounded-md w-full " +
              (!busy ? "bg-yellow-400" : "bg-gray-400"))
          }
          onClick={processToPlatform}
        >
          Оформить заказ
        </button>
      )}
      <div className={classNames("border-t w-full my-3 gap-0.5")} />
      <ul>
        {items?.map((item, i) => (
          <ShopItem
            item={item}
            className={classNames("w-full bg-white rounded-xl shadow-md overflow-hidden")}
            onClick={() =>
              chrome.tabs.query(
                { currentWindow: true, active: true },
                function (tab) {
                  chrome.tabs.create({
                    url: item.url,
                    active: true,
                  });
                }
              )
            }
          />
        ))}
      </ul>
    </div>
  );
}
