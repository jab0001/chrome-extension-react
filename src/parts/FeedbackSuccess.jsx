

import React, { useState, useEffect, useContext } from "react";
import { InnerMenu } from "../components/InnerMenu";
import { SimpleDivider } from "../components/SimpleDivider";
import classNames from "../utils/classTransform";
import { MenuContext } from "./AppContent";
import { TextInput } from "../components/TextInput";
import { TextArea } from "../components/TextArea";
import { Button } from "../components/Button";
import { LogoIcon } from "../icons";

export function FeedbackSuccess() {
  const { menuOpen, setCurrentPic } = useContext(MenuContext)
  const [fields, setFields] = useState({})

  const updateField = (name, value) => {
    setFields({
      ...fields,
      [name]: value
    })
  }

  const isReadyToSubmit = () => {
    return !!fields.name && !!fields.phone
  }

  const onSubmit = () => {
    console.log(fields)
  }

  return (
    <div className={classNames('flex w-[100%] flex-grow flex-col')}>
      <SimpleDivider />
      <div className={classNames('flex relative w-[100%] h-[100%] flex-row flex-grow')}>
        <div className={classNames('overflow-y-auto text-[16px] text-white flex-grow min-w-[450px] max-w-[450px] p-[37px]')}>
          <div className={classNames('mb-[16px] pr-[16px] flex flex-row align-center items-center w-min rounded-[5px] border border-[#3F3E3B] gap-[16px]')}>
            <LogoIcon width="42" height="33" />
            <a href="https://flgchina.ru/" target="_blank" className={classNames('text-white font-Ruberoid text-[18px] font-semibold')}>FLGCHINA.RU</a>
          </div>
          <div className={classNames('flex flex-col justify-center items-center pt-[80px] gap-[24px]')}>
            <h1 className={classNames('text-[32px] text-center')}>Спасибо</h1>
            <img width="96" src={chrome.runtime.getURL('/assets/form-success.png')} />
            <p className={classNames('text-[16px] text-center')}>Ваша заявка принята, свяжемся с вами в ближайшее время</p>
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