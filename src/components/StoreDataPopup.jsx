import { useEffect, useState } from "react";

import classNames from "../utils/classTransform";
import * as Sentry from "@sentry/react";

export function StoreDataPopup({ className, alwaysOpen = false }) {
  const [store, set_store] = useState();
  const [show_store, set_show_store] = useState(false);
  const [ratings, set_ratings] = useState();

  useEffect(() => {
    chrome.runtime.sendMessage(
      { message: "retrieve_seller" },
      ({ result, error }) => {
        if (!result) return;
        set_store(result);

        const new_ratings = {};
        Object.values(result.appData.serviceList).forEach((v) => {
          new_ratings[v.serviceKey] = v.score;
        });
        set_ratings(new_ratings);
      }
    );
  }, []);

  const num_word = (value, words = ["год", "года", "лет"]) => {
    value = Math.abs(value) % 100;
    var num = value % 10;
    if (value > 10 && value < 20) return words[2];
    if (num > 1 && num < 5) return words[1];
    if (num == 1) return words[0];
    return words[2];
  };

  return (
    <div className={className}>
      {store && !alwaysOpen && (
        <button
          className={classNames("w-full bg-yellow-400 p-[4px] rounded border")}
          onClick={() => set_show_store(!show_store)}
        >
          {show_store ? "Скрыть" : "Показать данные о поставщике"}
        </button>
      )}
      {store && (show_store || alwaysOpen) && (
        <div className={classNames("w-full bg-white rounded-[12px] shadow-md flex flex-col justify-center items-center p-[4px] gap-[4px]")}>
          <h1 className={classNames("p-[4px] text-[20px] font-bold text-gray-800")}>
            Информация о поставщике
          </h1>
          <div className={classNames("flex flex-col gap-[4px] justify-end")}>
            <div className={classNames("flex flex-row items justify-around items-center gap-[8px]")}>
              <img className={classNames("w-[48px]")} src={store.companyLogo} />
              <a
                className={classNames("hover:underline")}
                alt="Ссылка на продавца"
                href={store?.factoryInfo?.shopProperty?.pcLinkUrl}
              >
                {store.companyName || store.factoryInfo.companyName}
              </a>
            </div>
            <div className={classNames("flex flex-row items justify-center items-center gap-[8px]")}>
              <span className={classNames("font-bold text-gray-800")}>
                {store.bizTypeName == "生产型" ? "Производитель" : "Посредник"}{" "}
              </span>
              <span>
                Зарегистрирован {store.tpYear} {num_word(store.tpYear)} назад
              </span>
            </div>
          </div>
          <h1 className={classNames("p-[4px] font-bold text-gray-800")}>Оценки магазина</h1>
          Ошибка! Не возвраты товаров, а возвраты клиентов для повторного заказа
          <div className={classNames("flex flex-row items justify-center items-center gap-[8px]")}>
            <span>Процент клиентов, разместивших более одного заказа: </span>
            <span className={classNames("font-bold text-center text-[20px]")}>
              {(+store.retentionRate * 100).toFixed(0)} %
            </span>
          </div>
          <div className={classNames("grid grid-cols-3 gap-[4px]")}>
            <span>Оценка клиентов: </span>
            <span className={classNames("text-center font-bold")}>
              {store.appData.customerStar}
            </span>
            <RatingBar score={store.appData.customerStar} />

            <span>Консультации: </span>
            <span className={classNames("text-center font-bold")}>
              {ratings.cst_group_value_new}
            </span>
            <RatingBar score={ratings.cst_group_value_new} />

            <span>Логистика: </span>
            <span className={classNames("text-center font-bold")}>
              {ratings.lgt_group_value_new}
            </span>
            <RatingBar score={ratings.lgt_group_value_new} />

            <span>Возвраты: </span>
            <span className={classNames("text-center font-bold")}>
              {ratings.rdf_group_value_new}
            </span>
            <RatingBar score={ratings.rdf_group_value_new} />

            <span>Разрешение споров: </span>
            <span className={classNames("text-center font-bold")}>
              {ratings.dspt_group_value}
            </span>
            <RatingBar score={ratings.dspt_group_value} />

            <span>Качество товара: </span>
            <span className={classNames("text-center font-bold")}>
              {ratings.goods_group_value}
            </span>
            <RatingBar score={ratings.goods_group_value} />
          </div>
        </div>
      )}
    </div>
  );
}
function RatingBar({ score }) {
  const desired_width = (() => {
    switch (parseInt(score)) {
      case 4:
        return "w-4/5";
      case 3:
        return "w-3/5";
      case 2:
        return "w-2/5";
      case 1:
        return "w-1/5";

      default:
        return "w-full";
    }
  })();
  return (
    <div className={classNames("my-auto")}>
      <div className={classNames("bg-gray-400 rounded-full h-[8px] w-full")}></div>
      <div
        className={
          classNames("bg-gradient-to-r -mt-[8px] from-red-400 to-red-600 rounded-full h-[8px] " +
            desired_width)
        }
      ></div>
    </div>
  );
}