

import React, { useState, useEffect, useContext } from "react";
import { InnerMenu } from "../components/InnerMenu";
import { SimpleDivider } from "../components/SimpleDivider";
import classNames from "../utils/classTransform";
import { MenuContext } from "./AppContent";
import { TextInput } from "../components/TextInput";
import { TextArea } from "../components/TextArea";
import { Button } from "../components/Button";
import { LogoIcon } from "../icons";

export function FeedbackForm() {
  const { menuOpen, setCurrentPic } = useContext(MenuContext)
  const [fields, setFields] = useState({})
  const [loading, setLoading] = useState(false)

  const updateField = (name, value) => {
    setFields({
      ...fields,
      [name]: value
    })
  }

  const isReadyToSubmit = () => {
    return !!fields.name && !!fields.phone && !loading
  }

  const onSubmit = async () => {
    // TODO send request
    setLoading(true)
    await fetch(
      `https://api.flg-platform.com/api/v1/amo/leads/flgext`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fields.name,
          phone: fields.phone,
          comment: fields.comment
        }),
      }
    );
    setLoading(false)
    console.log(fields)
    setFields({})
    menuOpen('formSuccess')
  }

  return (
    <div className={classNames('flex w-[100%] flex-grow flex-col flex-1 overflow-y-scroll')}>
      <SimpleDivider />
      <div className={classNames('flex relative w-[100%] h-[100%] flex-row flex-grow')}>
        <div className={classNames('overflow-y-auto text-[16px] text-white flex-grow min-w-[450px] max-w-[450px] p-[37px]')}>
          <div className={classNames('mb-[16px] pr-[16px] flex flex-row align-center items-center w-min rounded-[5px] border border-[#3F3E3B] gap-[16px]')}>
            <LogoIcon width="42" height="33" />
            <a href="https://flgchina.ru/" target="_blank" className={classNames('text-white font-Ruberoid text-[18px] font-semibold')}>FLGCHINA.RU</a>
          </div>
          <h1 className={classNames('text-[32px] pb-[8px]')}>Доставка из Китая за 12 дней и от 2,2$/кг</h1>
          <p className={classNames('text-[16px]')}>Минимальная сумма заказа 100 000 руб</p>
          <ul className={classNames('list-disc ml-[16px] mt-[4px]')}>
            <li className={classNames('list-disc text-[16px]')} >Возим во все регионы России и страны СНГ;</li>
            <li className={classNames('list-disc text-[16px]')}>Доставляем контейнерные и сборные грузы;</li>
            <li className={classNames('list-disc text-[16px]')}>Отправляем все виды грузов от 10 кг;</li>
          </ul>
          <div className={classNames('flex flex-col gap-[16px] mt-[32px]')}>
            <div className={classNames('flex flex-col gap-[8px]')}>
              <label htmlFor="name">Имя</label>
              <TextInput
                value={fields.name}
                name="name"
                onChange={(value) => updateField("name", value)}
                placeholder="Ваше имя"
              />
            </div>
            <div className={classNames('flex flex-col gap-[8px]')}>
              <label htmlFor="phone">Ваш телефон</label>
              <TextInput
                value={fields.phone}
                name="phone"
                onChange={(value) => updateField("phone", value)}
                placeholder="+7 (XXX) XXX XX XX"
              />
            </div>
            <div className={classNames('flex flex-col gap-[8px]')}>
              <label htmlFor="comment">Комментарий</label>
              <TextArea
                value={fields.comment}
                name="comment"
                onChange={(value) => updateField("comment", value)}
                placeholder="Ссылка на товар или описание вашей ситуации"
              />
            </div>
            <div className={classNames('flex flex-col gap-[8px]')}>
              <Button onClick={onSubmit} enabled={isReadyToSubmit()}>
                {loading ? "Идет отправка" : "Отправить"}
              </Button>
            </div>
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