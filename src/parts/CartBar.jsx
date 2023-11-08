import React, { useEffect, useState, useContext } from "react";
import { Button } from "../components/Button";
import { CartItem } from "../components/CartItem";
import { InnerMenu } from "../components/InnerMenu";
import { LinkButton } from "../components/LinkButton";

import { SimpleDivider } from "../components/SimpleDivider";
import { CartIcon } from "../icons";
import classNames from "../utils/classTransform";
import { MenuContext } from "./AppContent";
import * as Sentry from "@sentry/react";

export function CartBar() {
  const [cart, setCart] = useState([])
  const { menuOpen, setCurrentPic } = useContext(MenuContext)

  const handleSendToPlatform = () => {
    chrome.runtime.sendMessage({
      message: "process_to_platform",
      items: JSON.stringify({ items: cart }),
    }, ({ error }) => {
    });
  }

  const removeItem = (url, sku) => {
    const newItems = cart.map((val) => {
      const curArr = cart.filter((val) => val.url === url)

      if (curArr.length === 0) {
        return val
      }

      const skus = val.skus.filter((csku) => csku.skuId !== sku)

      if (skus.length === 0) {
        return null;
      }

      const count = skus.reduce((a, c) => a + (c?.count || 0), 0)

      return {
        ...val,
        skus,
        amount: skus.reduce((a, c) => a + parseFloat((c?.price || 0) + 0), 0).toFixed(2) * count,
        count
      }
    }).filter((n) => n)

    chrome.runtime.sendMessage(
      { message: "store_cart", state: JSON.stringify(newItems) },
      ({ message, error }) => {
        if (error) {
          Sentry.captureException({ message, error });
        }
        else {
          setCart(newItems);
        }
      }
    );
  }

  const handleClear = () => {
    chrome.runtime.sendMessage(
      { message: "store_cart", state: JSON.stringify([]) },
      ({ message, error }) => {
        if (error) {
          Sentry.captureException({ message, error });
        }
        else {
          setCart([]);
        }
      }
    );
  }

  const addToFav = (url) => {
    const item = cart.filter((val) => val.url === url)

    if (item.length > 0) {
      chrome.runtime.sendMessage(
        { message: "retrieve_favorite" },
        ({ state, error }) => {
          const fav = JSON.parse(state);

          if (fav.filter((val) => val.url === item[0].url)?.length === 0) {
            chrome.runtime.sendMessage(
              {
                message: "store_favorite",
                favorite: JSON.stringify([...fav,
                {
                  url: item[0].url,
                  img: item[0].img,
                  price: item[0].skuModel.skuPriceScale,
                  title: item[0].title
                }])
              },
              ({ message, error }) => {
                if (error) {
                  Sentry.captureException({ message, error });
                }
              }
            );
          }
        }
      );
    }
  }

  useEffect(() => {
    chrome.runtime.sendMessage(
      { message: "retrieve_cart" },
      ({ state, error }) => {
        setCart(JSON.parse(state));
      }
    );
  }, [])

  return (
    <div className={classNames('flex w-[100%] flex-col flex-grow flex-1 overflow-hidden')}>
      <SimpleDivider />
      <div className={classNames('flex w-[100%] text-[#C9CED6] items-center justify-around h-[35px] min-h-[35px]')}>
        <p className={classNames('text-[10px]')}>
          {`Позиции: ${cart.length}`}
        </p>
        <LinkButton onClick={handleClear} className={classNames('text-[10px]')}>
          Очистить все
        </LinkButton>
      </div>
      <SimpleDivider />
      <div className={classNames('flex relative w-[100%] flex-row flex-grow overflow-hidden')}>
        <div className={classNames(`text-black pt-[19px] pl-[37px] ${cart.length > 0 ? 'pr-[29px]' : 'pr-[9px]'} flex flex-col w-[463px]`)}>
          {cart.length > 0 && <Button onClick={handleSendToPlatform} className={classNames('text-[#000000] mb-[24px] justify-start')}>
            <div className={classNames('flex items-center w-[140px] pl-[15px]')}>
              <CartIcon height={'9px'} width={'9px'} color={'#000000'} />
              <p className={classNames('text-[14.5px] ml-[7px] font-bold')}>
                {`¥ ${cart.reduce((a, c) => parseFloat(a + c?.amount || 0), 0).toFixed(2)}`}
              </p>
            </div>
            <SimpleDivider vetical className={classNames('h-[100%] bg-[#666666] mr-[24px]')} />
            <p className={classNames('underline text-[11.5px] mr-[18px]')}>
              оформить заказ за 2 минуты
            </p>
            <p className={classNames('text-[12.5px] underline font-medium')}>
              FLG
            </p>
          </Button>}
          <div className={classNames('overflow-x-hidden overflow-y-scroll')}>
            <div
              style={{
                backgroundImage: cart.length > 0 ? 'unset' : `url(${chrome.runtime.getURL('/assets/cart_placeholder.jpg')})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                marginLeft: '1px',
                backgroundSize: '416.5px auto',
                marginTop: '.5px',
                paddingBottom: '30px',
                height: cart.length > 0 ? 'min-content' : '750px'
              }}
              className={classNames('mb-[4px] flex flex-col h-[750px] items-center')}
            >
              {cart.reduce((a, c) => {
                return [...a, ...c.skus.map((val) => {
                  return {
                    img: c?.skuModel?.skuProps[0]?.value?.filter((img) => img?.name === val.name)[0]?.imageUrl || c.img,
                    url: c.url,
                    title: val.name,
                    count: val.count,
                    inchina: c.inchina,
                    skuId: val.skuId,
                    amount: (parseFloat(val.price ?? val.discountPrice) * val.count).toFixed(2)
                  }
                })]
              }, []).map((val) =>
              (<div className={classNames("mb-[15px]")}>
                <CartItem
                  item={val}
                  className={classNames("w-full bg-white rounded-[12px] shadow-md overflow-hidden mb-[4px]")}
                  onRemove={() => removeItem(val.url, val.skuId)}
                  onAddFavorite={() => addToFav(val.url)}
                />
              </div>))}
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