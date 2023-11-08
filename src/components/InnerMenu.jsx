import React, { useEffect, useState, useContext } from "react";
import { CartIcon, FavoriteIcon, LogoIcon, SearchIcon, InfoIcon } from "../icons";
import { MenuContext } from "../parts/AppContent";

import classNames from "../utils/classTransform";
import { Divider } from "./Divider";
import { IconButton } from "./IconButton";
import * as Sentry from "@sentry/react";

export function InnerMenu({ openCart, openFavorite, openSearch, openStore, openForm, shown = true }) {
  const [cart, setCart] = useState(0)
  const [favorite, setFavorite] = useState(0)
  const is1688item = window.location.host === 'detail.1688.com'
  const { currentPic } = useContext(MenuContext)

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
    <div className={classNames(`rounded-[10px] transition-all ${shown ? 'opacity-100' : 'opacity-0'} flex flex-col w-[89px] h-[300px] items-center pt-[24px]`)}>
      <IconButton onClick={openForm} className={classNames('rounded-[11.7px] h-[42px] w-[81px]')}>
        <LogoIcon width="32" height="26.2" />
      </IconButton>
      {(currentPic || is1688item) && <>
        <IconButton onClick={openSearch} className={classNames('hover:bg-[#7F6B36] rounded-[11.7px] h-[42px] w-[81px]')}>
          <SearchIcon width="16.2" height="16.2" />
        </IconButton>
        <Divider className={classNames('w-[50px]')} />
      </>}
      <IconButton onClick={openCart} badge={cart > 0 ? cart : null} badgeSize={'sx'} className={classNames('hover:bg-[#7F6B36] rounded-[11.7px] h-[42px] w-[81px]')}>
        <CartIcon width="18.4" height="18.4" />
      </IconButton>
      <Divider className={classNames('w-[50px]')} />
      <IconButton onClick={openFavorite} badge={favorite || 0 > 0 ? favorite : null} badgeSize={'sx'} className={classNames('hover:bg-[#7F6B36] rounded-[11.7px] h-[42px] w-[81px]')}>
        <FavoriteIcon width="14.9" height="13.6" />
      </IconButton>
      {is1688item && <>
        <Divider className={classNames('w-[50px]')} />
        <IconButton onClick={openStore} className={classNames('hover:bg-[#7F6B36] rounded-[11.7px] h-[42px] w-[81px]')}>
          <InfoIcon width="15" height="15" />
        </IconButton>
      </>}
    </div>
  );
}
