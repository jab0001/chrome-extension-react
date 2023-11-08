import { useEffect, useState, useContext } from "react";
import { MenuContext } from "../parts/AppContent";

import classNames from "../utils/classTransform";
import { InnerMenu } from "../components/InnerMenu";
import { SimpleDivider } from "../components/SimpleDivider";
import { StarIcon } from "../icons";
import { Link } from "../components/Link";
import * as Sentry from "@sentry/react";
import { Button } from "../components/Button";

const starsRegex = /-([\d\-]+).png/i

export function InfoBar({ className, alwaysOpen = false }) {
  const [store, set_store] = useState();
  const [ratings, set_ratings] = useState();
  const { menuOpen, setCurrentPic } = useContext(MenuContext)

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

  const isManufacturer = (value, words = ['生产型', '生产厂家']) => {
    return words.includes(value)
  }

  const positions = store && ratings ? [
    {
      id: 5,
      title: "Качество консультирования:",
      value: ratings.cst_group_value_new
    },
    {
      id: 3,
      title: "Отзывы по сроку доставки:",
      value: ratings.lgt_group_value_new
    },
    {
      id: 1,
      title: "Отзывы по возврату товара:",
      value: ratings.rdf_group_value_new
    },
    {
      id: 4,
      title: "Отзывы по обслуживанию:",
      value: ratings.dspt_group_value
    },
    {
      id: 2,
      title: "Оценка качества товара:",
      value: ratings.goods_group_value
    }
  ] : []


  return (
    <div className={classNames('flex w-[100%] flex-grow flex-col flex-1 overflow-hidden')}>
      <SimpleDivider />
      <div className={classNames('flex relative w-[100%] flex-grow overflow-hidden')}>
        <div className={classNames('text-black pt-[26px] flex items-center flex-col w-[463px] overflow-x-hidden overflow-y-scroll')}>
          {!!store && (
            <>
              <div className={classNames('flex w-[397px] h-[169px] bg-[#3F3E3B] text-[#C9CED6] rounded-[8px] mb-[23px]')}>
                <div className={classNames('h-[100%] flex items-center justify-center flex-col w-[123px]')}>
                  <img className={classNames("w-[50px] rounded-[50%] mb-[11px] ")} src={store?.companyLogo} />
                  <span className={classNames("font-bold")}>
                    {isManufacturer(store?.bizTypeName) ? "Производитель" : "Посредник"}{" "}
                  </span>
                </div>
                <SimpleDivider vetical className={classNames('h-[100%]')} />
                <div className={classNames('flex flex-col items-center w-[274px] h-[100%]')}>
                  <div className={classNames('flex text-[#C9CED6] pl-[27px] flex-col justify-center w-[100%] h-[106px]')}>
                    <div>
                      <Link text={store?.companyName || store?.factoryInfo.companyName} target="_blank" alt="Ссылка на продавца" href={store?.sellerPage || store?.factoryInfo?.shopProperty?.pcLinkUrl} className={classNames('text-[#8C8B8A]')} />
                      <span className={classNames("mb-[8px]")}>
                        {store.tpYear} {num_word(store.tpYear)}
                      </span>
                    </div>
                    <div className={classNames('grid grid-cols-auto-[24px] gap-[7px] w-[100%]')}>
                      {Array(parseInt(store.rateLogoUrl?.match(starsRegex)[1]?.split('-')?.reduce((p, c) => parseInt(p) / parseInt(c)) || 0)).fill(<StarIcon width={'24px'} height={'24px'} />)}
                    </div>
                  </div>
                  <SimpleDivider className={classNames('w-[100%]')} />
                  <div className={classNames('flex text-[#C9CED6] pl-[27px] flex-col w-[100%] justify-center h-[63px]')}>
                    <span className={classNames("mb-[8px] flex items-center")}>
                      {store?.address && (
                        <>
                          <img
                            className={classNames("mr-[7px] h-[14px] w-[14px]")}
                            src={chrome.runtime.getURL('/assets/pin.png')}
                          />
                          <p>
                            {store?.address}
                          </p>
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <div className={classNames('w-[397px] h-[275px] bg-[#3F3E3B] rounded-[8px]')}>
                <div className={classNames('flex flex-col w-[100%] pt-[41px] pl-[49px] pr-[69px] text-[#C9CED6]')}>
                  {positions.sort((a, b) => a.id - b.id).map((val) =>
                    <>
                      <div key={val.id} className={classNames('grid w-[100%] grid-cols-2 gap-x-[22px] text-[12px] leading-[14px] mb-[7px]')}>
                        <p className={classNames('text-[12px] w-[159px] leading-[14px] text-left')}>
                          {val.title}
                        </p>
                        <div className={classNames('flex items-center justify-end')}>
                          <p className={classNames('text-[15.4px] leading-[18px] mr-[6px]')}>{val.value}</p>
                          <Rating score={val.value} />
                        </div>
                      </div>
                      <SimpleDivider className={classNames('w-[100%] mb-[8px]')} />
                    </>
                  )}
                  {!!store.retentionRate &&
                    <>
                      <div className={classNames('grid mt-[31px] w-[100%] grid-cols-2 gap-x-[22px] text-[12px] leading-[14px] mb-[7px]')}>
                        <p className={classNames('text-[12px] w-[159px] leading-[14px] text-left')}>
                          Процент повторного заказа
                        </p>
                        <div className={classNames('flex items-center justify-end')}>
                          <p className={classNames('text-[15.4px] leading-[18px] mr-[6px]')}>{Math.round(parseFloat(store.retentionRate) * 100)}%</p>
                        </div>
                      </div>
                      <SimpleDivider className={classNames('w-[100%] mb-[8px]')} />
                    </>}
                </div>
              </div>
            </>
          )}
          <div className={classNames('flex flex-col gap-[16px] mt-[16px] w-[397px]')}>
            <Button onClick={() => menuOpen('form')}>
              Заказать товар из китая
            </Button>
            <a className={classNames('w-full')} href="https://flgchina.ru/newfind/" target="_blank">
              <Button className={classNames('w-full')}>
                Найти поставщика
              </Button>
            </a>
          </div>
        </div>
        <SimpleDivider vetical />
        <div>
          <div className={classNames('h-[35px]')}>
          </div>
          <SimpleDivider />
          <InnerMenu
            openForm={() => menuOpen('form')}
            openSearch={() => setCurrentPic()}
            openCart={() => menuOpen('cart')}
            openFavorite={() => menuOpen('favorite')}
            openStore={() => menuOpen('store')}
          />
        </div>
      </div>
    </div >
  );
}

function Rating({ score }) {
  const items = Array(5).fill(
    <div
      style={{ background: 'linear-gradient(180deg, #F5DD6D 0%, #FFCD4D 100%)' }}
      className={classNames('h-[8px] w-[13.82px] rounded-[2px]')}>
    </div>)

  return (
    <div className={classNames('grid grid-cols-5 gap-x-[1.45px]')}>
      {items.fill(<div className={classNames('h-[8px] w-[13.82px] rounded-[2px] bg-[#595959]')}></div>, parseInt(score), 5)}
    </div>
  )
}