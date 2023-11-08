import React, { useState, useEffect } from "react";

import { Button } from "../components/Button";
import { CartIcon, FavoriteIcon, InfoIcon } from "../icons";
import classNames from "../utils/classTransform";

import * as Sentry from "@sentry/react"

export function AppButtons() {


  const setItem = async () => {
    chrome.runtime.sendMessage(
      {
        message: "add_from_page"
      },
      ({ error }) => {
        if (error == 'no items') {
          alert('Нужно выбрать товар');
        }
      }
    );
  };

  const setFavorite = async () => {
    chrome.runtime.sendMessage(
      {
        message: "add_fav"
      },
      ({ error }) => {
      }
    );
  };

  const openInfo = async () => {
    chrome.runtime.sendMessage(
      {
        message: "open_sidebar",
        tab: 'store'
      },
      ({ error }) => {
      }
    );
  };

  return (
    <div className={classNames('flex flex-row mt-[8px] gap-[12px]')}>
      <Button className={classNames('w-[162px]')} onClick={setFavorite}>
        <FavoriteIcon height={'15px'} width={'15px'} color={'black'} />
        <p className={classNames('font-bold')}>
          В ИЗБРАННОЕ
        </p>
      </Button>
      <Button onClick={setItem} className={classNames('w-[162px]')}>
        <CartIcon height={'15px'} width={'14px'} color={'black'} />
        <p className={classNames('font-bold')}>
          В КОРЗИНУ
        </p>
      </Button>
      <Button onClick={openInfo} className={classNames('w-[162px]')}>
        <InfoIcon height={'18px'} width={'18px'} color={'black'} />
        <p className={classNames('font-bold')}>
          О ПОСТАВЩИКЕ
        </p>
      </Button>
    </div>

  );
}