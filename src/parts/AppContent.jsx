import React, { useEffect, useState, createContext } from "react";

import { Sidebar } from "../components/SideBar";
import { SidebarMenu } from "./SidebarMenu";
import classNames from "../utils/classTransform";
import { SearchBar } from "./SearchBar";
import { CartBar } from "./CartBar";
import { FavoriteBar } from "./FavoriteBar";
import { getBase64Image, waitForElement } from "../utils/imageUtil";
import { InfoBar } from "./InfoBar";
import AreaSelector from "./AreaSelector";
import { TopBar } from "../components/TopBar";
import * as Sentry from "@sentry/react";
import { FeedbackForm } from "./FeedbackForm";
import { FeedbackSuccess } from "./FeedbackSuccess";

export const MenuContext = createContext()

export default function App() {
  const is1688item = window.location.host === 'detail.1688.com'
  const is1688 = window.location.host.endsWith('1688.com')

  const [pic1688item, setPic1688item] = useState(null)
  const [areaSelector, setAreaSelector] = useState(false)

  const [currentPic, setCurrentPic] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentOpened, setCurrentOpened] = useState('search')

  const names = {
    search: 'ПОИСК ПО ФОТО',
    store: 'ИНФОРМАЦИЯ О ПОСТАВЩИКЕ',
    cart: 'КОРЗИНА',
    favorite: 'ИЗБРАННОЕ',
    form: 'FLGCHINA.RU',
    formSuccess: 'FLGCHINA.RU'
  }

  useEffect(() => {
    if (is1688item) {
      waitForElement('*:is(.style-custom-sku-wrapper, .detail-affix-sku-wrapper)', () => {
        chrome.runtime.sendMessage({
          message: "get_current"
        }, ({ data, error }) => {
          const { images, tempModel } = data;
          const img = images[0].fullPathImageURI;
          const title = tempModel.offerTitle;

          getBase64Image(img).then(base64Image => {
            setPic1688item({
              img: base64Image,
              title
            })
          }).catch((e) => console.log(e))
        });
      })
    }
  }, [is1688item])

  useEffect(() => {
    chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
      switch (msg.action) {
        case 'search_by_area':
          setAreaSelector(true);
          break;
        case 'open_sidebar':
          setCurrentOpened(msg.tab)
          setSidebarOpen(true)
          break;
        default:
          break;
      }
      return true;
    });
  }, [])

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [sidebarOpen])

  const handleSidebarOpen = (isOpen) => {
    setSidebarOpen(isOpen)
  }

  const handleSetCurrentPic = (img = null) => {
    getBase64Image(img || currentPic || pic1688item?.img)
      .then(base64Image => setCurrentPic(base64Image))
      .catch((e) => { });
    setCurrentOpened('search')
    setSidebarOpen(true)
  }

  const handleCurrentOpened = (current) => {
    setCurrentOpened(current)
    setSidebarOpen(true)
  }

  const handleTakeAreaPicture = (picture) => {
    setCurrentPic(picture)
    setCurrentOpened('search')
    setSidebarOpen(true)
    setAreaSelector(false)
  }

  return (
    <>
      {/* <ImageButton handleClick={handleSetCurrentPic} /> */}
      {(areaSelector && !sidebarOpen) && <AreaSelector onClose={() => setAreaSelector(false)} onTakePicture={handleTakeAreaPicture} />}
      <Sidebar
        className={classNames('font-[500] font-SFUIText text-[12px] text-[#FFFFFF]')}
        open={sidebarOpen}
        setOpen={(open) => handleSidebarOpen(open)}
        startPic={pic1688item?.img || null}
        showMenu={!!pic1688item?.img || is1688}
        isLeftHide={!is1688}
        sidebarMenu={
          <SidebarMenu
            is1688item={is1688item}
            currentPic={currentPic}
            openSearch={() => handleSetCurrentPic(pic1688item?.img || null)}
            openCart={() => handleCurrentOpened('cart')}
            openFavorite={() => handleCurrentOpened('favorite')}
            openStore={() => handleCurrentOpened('store')}
            openForm={() => handleCurrentOpened('form')}
            shown={!sidebarOpen}
          />}
      >
        <MenuContext.Provider value={{ currentPic: currentPic, menuOpen: handleCurrentOpened, currentOpened: currentOpened, setCurrentPic: handleSetCurrentPic }} >
          <TopBar className={classNames('w-[100%] min-h-[73px] h-[73px]')} name={names[currentOpened]} onClose={() => handleSidebarOpen(false)} />
          <SearchBar isOpened={currentOpened === 'search'} currentPic={currentPic} title={pic1688item?.title} />

          {currentOpened === 'store' && sidebarOpen && <InfoBar className={classNames('w-[553px] p-[4px]')} alwaysOpen />}
          {currentOpened === 'cart' && sidebarOpen && <CartBar />}
          {currentOpened === 'favorite' && sidebarOpen && <FavoriteBar />}
          {currentOpened === 'form' && sidebarOpen && <FeedbackForm />}
          {currentOpened === 'formSuccess' && sidebarOpen && <FeedbackSuccess />}
        </MenuContext.Provider>
      </Sidebar >
    </>
  );
}
