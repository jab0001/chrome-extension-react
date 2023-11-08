import React, { useEffect, useState } from "react";
import { CartIcon, FavoriteIcon, LogoIcon, SearchIcon, InfoIcon } from "../icons";

import classNames from "../utils/classTransform";
import { Divider } from "../components/Divider";
import { IconButton } from "../components/IconButton";
import * as Sentry from "@sentry/react";

export function SidebarMenu({ openCart, openFavorite, openSearch, openStore, openForm, shown = true, is1688item = false, currentPic }) {
  const [cart, setCart] = useState(0)
  const [favorite, setFavorite] = useState(0)

  useEffect(() => {
    chrome.runtime.sendMessage(
      { message: "retrieve_favorite" },
      ({ state, error }) => {
        setFavorite(JSON.parse(state).length);
      }
    );

    chrome.runtime.sendMessage(
      { message: "retrieve_cart" },
      ({ state, error }) => {
        setCart(JSON.parse(state).reduce((a, c) => a + c?.count, 0));
      }
    );

    chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
      switch (msg.action) {
        case 'storage_changed':
          switch (msg.key) {
            case 'cart':
              setCart(JSON.parse(msg.value).reduce((a, c) => a + c?.count, 0));
              break;
            case 'favorite':
              setFavorite(JSON.parse(msg.value).length);
              break;
            default:
              break;
          }
          break;
        default:
          break;
      }
      return true;
    });
  }, [])

  return (
    <div className={classNames(`rounded-[10px] transition-all ${shown ? 'opacity-100' : 'opacity-0'} bg-[#2D2D2D] flex justify-center items-center flex-col w-[65px] h-[auto] pb-[4px]`)}>
      <IconButton onClick={openForm} className={classNames('hover:cursor-pointer rounded-[11.7px] h-[51.5px] w-[51.5px]')}>
        <LogoIcon width="42" height="51.5" />
      </IconButton>
      {(is1688item || currentPic) && <>
        <Divider className={classNames('w-[50px]')} />
        <IconButton onClick={openSearch} className={classNames('hover:bg-[#7F6B36] rounded-[11.7px] h-[51.5px] w-[51.5px]')}>
          <SearchIcon width="21.6" height="21.6" />
        </IconButton>
      </>}
      <Divider className={classNames('w-[50px]')} />
      <IconButton badge={cart > 0 ? cart : null} onClick={openCart} className={classNames('hover:bg-[#7F6B36] rounded-[11.7px] h-[51.5px] w-[51.5px]')}>
        <CartIcon width="24.6" height="24.6" />
      </IconButton>
      <Divider className={classNames('w-[50px]')} />
      <IconButton badge={favorite || 0 > 0 ? favorite : null} onClick={openFavorite} className={classNames('hover:bg-[#7F6B36] rounded-[11.7px] h-[51.5px] w-[51.5px]')}>
        <FavoriteIcon width="19.8" height="18.2" />
      </IconButton>
      {is1688item && <>
        <Divider className={classNames('w-[50px]')} />
        <IconButton onClick={openStore} className={classNames('hover:bg-[#7F6B36] rounded-[11.7px] h-[51.5px] w-[51.5px]')}>
          <InfoIcon width="20" height="20" />
        </IconButton>
      </>}
    </div>
  );
}
