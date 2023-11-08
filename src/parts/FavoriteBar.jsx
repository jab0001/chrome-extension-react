

import React, { useState, useEffect, useContext } from "react";
import { Button } from "../components/Button";
import { InnerMenu } from "../components/InnerMenu";

import { FavoriteItem } from "../components/FavoriteItem";
import { SimpleDivider } from "../components/SimpleDivider";
import classNames from "../utils/classTransform";
import { MenuContext } from "./AppContent";
import { LinkButton } from "../components/LinkButton";
import * as Sentry from "@sentry/react";

export function FavoriteBar() {
  const [favorite, setFavorite] = useState([])
  const { menuOpen, setCurrentPic } = useContext(MenuContext)

  const handleClear = () => {
    chrome.runtime.sendMessage(
      { message: "store_favorite", favorite: JSON.stringify([]) },
      ({ message, error }) => {
        if (error) {
          Sentry.captureException({ message, error });
        }
        else {
          setFavorite([]);
        }
      }
    );
  }

  const removeItem = (url) => {
    const newItems = favorite.filter((val) => val.url !== url)
    chrome.runtime.sendMessage(
      { message: "store_favorite", favorite: JSON.stringify(newItems) },
      ({ message, error }) => {
        if (error) {
          Sentry.captureException({ message, error });
        }
        else {
          setFavorite(newItems);
        }
      }
    );
  }

  useEffect(() => {
    chrome.runtime.sendMessage(
      { message: "retrieve_favorite" },
      ({ state, error }) => {
        setFavorite(JSON.parse(state));
      }
    );
  }, [])

  return (
    <div className={classNames('flex w-[100%] flex-grow flex-col flex-1 overflow-hidden')}>
      <SimpleDivider />
      <div className={classNames('text-[#C9CED6] text-[10px] flex w-[100%] items-center justify-around h-[35px] min-h-[35px]')}>
        <p className={classNames('text-[10px]')}>
          {`Позиции: ${favorite.length}`}
        </p>
        <LinkButton onClick={handleClear} className={classNames('text-[10px]')}>
          Очистить все
        </LinkButton>
      </div>
      <SimpleDivider />
      <div className={classNames('flex relative w-[100%] h-[100%] flex-row flex-grow')}>
        <div className={classNames('flex-grow overflow-y-scroll')}>
          <div
            style={{
              backgroundImage: favorite.length > 0 ? 'unset' : `url(${chrome.runtime.getURL('/assets/favorite_placeholder.jpg')})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundOrigin: 'content-box',
              paddingBottom: '30px',
              height: favorite.length > 0 ? 'min-content' : '750px'
            }}
            className={classNames(`text-black p-[10px] flex flex-col h-[700px] w-[463px] items-center`)}>
            {favorite.map((val, index) =>
            (<div className={classNames('mb-[15px]')}>
              <FavoriteItem
                image={val.img}
                title={val.title}
                price={'¥ ' + val.price}
                link={val.url}
                onRemove={() => removeItem(val.url)}
              />
            </div>))}
          </div>
        </div>
        <SimpleDivider vetical />
        <InnerMenu
          openForm={() => menuOpen('form')}
          openSearch={() => setCurrentPic()}
          openCart={() => menuOpen('cart')}
          openFavorite={() => menuOpen('favorite')}
          openStore={() => menuOpen('store')}
        />
      </div>
    </div>
  );
}