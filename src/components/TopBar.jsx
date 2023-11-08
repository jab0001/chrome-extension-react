import React, { useContext, useEffect, useState } from "react";
import { CloseIcon } from "../icons";

import classNames, { clx } from "../utils/classTransform";
import { Button } from "./Button";
import { IconButton } from "./IconButton";
import { MenuContext } from "../parts/AppContent";

export function TopBar({ name, onClose, className }) {
  const { menuOpen, currentOpened } = useContext(MenuContext)
  const [orderButtonVisible, showOrderButton] = useState(true)

  const currentPageIsCart = () => {
    return currentOpened === 'cart'
  }

  const currentPageIsInfo = () => {
    return currentOpened === 'store'
  }

  useEffect(() => {
    // When cart state changed there is need to rerender the button
    chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
      if (msg.action == 'storage_changed') {
        const itemsCount = JSON.parse(msg.value).reduce((a, c) => a + c?.count, 0)
        if (itemsCount > 0) {
          showOrderButton(false);
        } else {
          showOrderButton(true);
        }
      }
      return true;
    });
  }, [])

  useEffect(() => {
    if (currentPageIsInfo()) {
      showOrderButton(false);
    } else if (currentPageIsCart()) {
      chrome.runtime.sendMessage(
        { message: "retrieve_cart" },
        ({ state, error }) => {
          console.log('cartstate', JSON.parse(state))
          const itemsCount = JSON.parse(state).reduce((a, c) => a + c?.count, 0)
          if (itemsCount > 0) {
            showOrderButton(false);
          } else {
            showOrderButton(true);
          }
        }
      );
    } else {
      showOrderButton(true);
    }
    return true;
  }, [currentOpened])

  return (
    <div className={clx(className, classNames('flex flex-row items-center h-[79px] text-white pl-[37px] pr-[37px]'))}>
      <div>
        {
          name == 'FLGCHINA.RU'
            ? <a className={classNames('text-white')} href="https://flgchina.ru" target="_blank">{name}</a>
            : name
        }
      </div>
      <div className={classNames('grow flex justify-end mr-[40px]')}>
        {
          orderButtonVisible
            ? <Button onClick={() => menuOpen('form')}>
              Заказать товар из китая
            </Button>
            : <></>
        }
      </div>
      <div>
        <IconButton className={classNames('h-[20px] w-[20px]')} onClick={onClose}>
          <CloseIcon width="20" height="20" />
        </IconButton>
      </div>
    </div>
  );
}
