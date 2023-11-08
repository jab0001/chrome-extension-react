import React, { useState, useEffect, useContext } from "react";
import InfiniteScroll from 'react-infinite-scroll-component';

import { Item } from "../components/Item";
import { Alert } from "../components/Alert";
import classNames from "../utils/classTransform";
import { getBase64Image } from "../utils/imageUtil";
import { SimpleDivider } from "../components/SimpleDivider";
import { InnerMenu } from "../components/InnerMenu";
import { GirlIcon } from "../icons";
import { MenuContext } from "./AppContent";
import { Skeleton } from "../components/Skeleton";
import * as Sentry from "@sentry/react";
import { SortingButton } from "../components/SortingButton";
import { CapchaItem } from "../components/CapchaItem";

export function SearchBar({ isOpened, currentPic, title }) {
  const { menuOpen, setCurrentPic } = useContext(MenuContext)
  const [itemsList, setItemsList] = useState([])
  const [capchaLink, setCapchaLink] = useState('')
  const [currentPicData, setCurrentPicData] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [needToLoad, setNeedToLoad] = useState(false)
  const [status, setStatus] = useState(null)
  const [skip, setSkip] = useState(true);
  const [contextElement, setContextElement] = useState(null)
  const [doSearchByContext, setDoSearchByContext] = useState(false)
  const [sortState, setSortState] = useState({ type: 'desc', field: 'normal' })

  useEffect(() => {
    chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
      switch (msg.action) {
        case 'search_by_picture':
          if (msg.img)
            getBase64Image(msg.img)
              .then(base64Image => setCurrentPic(base64Image))
          else
            setDoSearchByContext(true)
          break;
        case 'send_status':
          setStatus(msg.status);
          break;
        default:
          break;
      }
      return true;
    });

    document.addEventListener("contextmenu", function (event) {
      setContextElement(event.target);
    }, true);
  }, [])

  useEffect(() => {
    if (!doSearchByContext) {
      return;
    }

    setDoSearchByContext(false)

    switch (contextElement.tagName) {
      case 'CANVAS':
        const imgCan = contextElement.parentNode.querySelector("img")

        if (imgCan) {
          getBase64Image(imgCan.src).then(base64Image => setCurrentPic(base64Image)).catch((e) => console.log(e));

        }
        break;
      default:
        const img = contextElement.querySelector("img")
        if (img) {
          getBase64Image(img.src).then(base64Image => setCurrentPic(base64Image)).catch((e) => console.log(e));
        }
        break;
    }

  }, [doSearchByContext, contextElement])

  useEffect(() => {
    if (skip) {
      setSkip(false)
      return;
    }

    handleClick(currentPic)
  }, [currentPic])

  useEffect(() => {
    handleSort()
  }, [sortState])

  const checkCoo = async () => {
    return new Promise(resolve => {
      chrome.runtime.sendMessage({
        message: "check_cookie"
      }, ({ has, error }) => {
        try {
          resolve(has)
        } catch (e) {
          Sentry.captureException(e)
          resolve(true)
        }
      })
    })
  }

  const setToken = async () => {
    let count = 0;

    if (!(await checkCoo())) {
      const qwer = document.createElement('iframe')
      qwer.src = 'https://1688.com/'
      qwer.style.height = 0
      qwer.style.width = 0
      document.body.append(qwer)

      await new Promise(resolve => setTimeout(resolve, 1000))
      while (!(await checkCoo()) && count < 10) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        count++;
        console.log('Try ' + count);
      }
      if (!(await checkCoo()))
        await new Promise(resolve => setTimeout(resolve, 1000)).catch(Sentry.captureException)
    }
  }

  const handleSort = async () => {
    setItemsList([])
    setCurrentPage(1)
    setNeedToLoad(false)

    setStatus({ type: 'info', text: 'Загрузка результата' });

    if (await fetchItems(currentPicData, true)) {
      setStatus(null);
    } else {
      setStatus({ type: 'error', text: 'Ошибка загрузки результата' });
    }

  }

  const handleClick = async (image) => {
    if (!image) {
      return;
    }

    setItemsList([])
    setCurrentPage(1)
    setNeedToLoad(false)

    if (image !== currentPic)
      setCurrentPic(image)

    setStatus({ type: 'info', text: 'Загрузка изображения' });

    await setToken();

    const imageData = await getImageData1688(image);

    if (imageData == null || Object.keys(imageData).length === 0) {
      setStatus({ type: 'error', text: 'Ошибка загрузки изображения' });

      return;
    }

    setStatus({ type: 'info', text: 'Загрузка результата' });

    setCurrentPicData(imageData)

    if (await fetchItems(imageData, true)) {
      setStatus(null);
    }
    else {
      setStatus({ type: 'error', text: 'Ошибка загрузки результата' });
    }
  }

  const formatItems = (data) => {
    const { offerList } = data

    const offers = offerList ?? [];

    return offers.map((offer) => {
      return {
        image: offer.image.imgUrl,
        title: offer.information.subject,
        price: offer.tradePrice.offerPrice.priceInfo.price,
        quantityPrices: offer.tradePrice.offerPrice.quantityPrices,
        link: offer.information.detailUrl
      }
    })
  }

  const fetchItems = async (data = null, isNew = false) => {
    const actualImgData = data || currentPicData
    const response = await chrome.runtime.sendMessage({
      message: "return_1688",
      ...actualImgData,
      beginPage: isNew ? 1 : currentPage,
      sorting: sortState
    });

    setCapchaLink(response.url)

    if (chrome.runtime.lastError) return false;

    if (isNew) {
      setCurrentPage(2)
    } else {
      setCurrentPage(currentPage + 1)
    }


    if (response == null) {
      setCurrentPage(currentPage - 1)
      return false
    }

    const finalItems = (isNew ? [] : itemsList).concat(formatItems(response))

    setItemsList(finalItems)
    setNeedToLoad(finalItems.length < response.totalCount)

    return true;
  }

  const getImageData1688 = async (imageBase64) => {
    const response = await chrome.runtime.sendMessage({
      message: "send_image_1688",
      imageBase64
    });

    if (chrome.runtime.lastError) return;

    return response
  }

  const addToFav = (item) => {
    chrome.runtime.sendMessage(
      { message: "retrieve_favorite" },
      ({ state, error }) => {
        const fav = JSON.parse(state);

        if (fav.filter((val) => val.url === item.url)?.length === 0) {
          chrome.runtime.sendMessage(
            {
              message: "store_favorite",
              favorite: JSON.stringify([...fav,
              {
                url: item.url,
                img: item.img,
                price: item.price,
                title: item.title
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

  const reverseSortType = (type) => {
    if (type == 'desc') {
      return 'asc'
    } else {
      return 'desc'
    }
  }

  const setSort = (sortField) => {
    if (sortState.field == sortField) {
      setSortState({
        type: reverseSortType(sortState.type),
        field: sortState.field
      });
    } else {
      setSortState({
        type: sortState.type,
        field: sortField
      });
    }
  }

  if (!isOpened) {
    return null;
  }

  return (
    <div className={classNames('flex w-[100%] flex-grow flex-col')}>
      <div className={classNames('flex w-[100%] items-center pl-[30px] pr-[55px] pb-[32px]')}>
        <div>
          <img style={{
            border: '4px solid #F5DD6D',
            boxSizing: 'border-box',
            maxWidth: '300px',
            objectFit: 'contain'
          }}
            className={classNames('h-[104px] rounded-[5px] bor')} src={currentPic} />
        </div>
        <div className={classNames('grow text-[#D9D9D9] h-[94px] pl-[25px]')} >
          <p>
            {title}
          </p>
          <p>

          </p>
        </div>
        <div className={classNames('opacity-[.3]')}>
          <GirlIcon className={classNames('h-[84px]')} />
        </div>
      </div>
      <SimpleDivider />
      <div className={classNames('flex flex-row w-[100%] items-center pl-[30px] pr-[55px] pt-[32px] pb-[15px] gap-[16px]')}>
        <div className={classNames('text-white text-base')}>Сортировать по:</div>
        <div className={classNames('flex flex-row gap-[16px]')}>
          <SortingButton
            title="по умолчанию"
            active={sortState.field == 'normal'}
            direction={sortState.type}
            onClick={() => setSort('normal')}
          />
          <SortingButton
            title="по продажам"
            active={sortState.field == 'sold_quantity'}
            direction={sortState.type}
            onClick={() => setSort('sold_quantity')}
          />
          <SortingButton
            title="по цене"
            active={sortState.field == 'price'}
            direction={sortState.type}
            onClick={() => setSort('price')}
          />
        </div>
      </div>
      <div className={classNames('flex relative w-[100%] flex-row flex-nowrap flex-shrink flex-grow')}>
        {capchaLink ? (
          <CapchaItem link={capchaLink} />
        ) : (
          <div id="scrollableDiv" className={classNames('overflow-x-hidden overflow-y-auto h-[750px] overscroll-contain relative')}>
            <InfiniteScroll
              className={classNames('grid p-[21px] pt-[24px] pl-[30px] gap-[18px] w-[720px] grid-cols-auto-[211px]')}
              dataLength={itemsList.length}
              next={fetchItems}
              hasMore={needToLoad && status?.type !== 'info'}
              loader={<div className={classNames('fixed bottom-[20px] left-[57%] rounded-[25px] bg-[#474747]')}><Alert /></div>}
              scrollableTarget="scrollableDiv"
            >
              {(itemsList?.length > 0 || false) ? itemsList.map((val, index) =>
                <Item
                  key={index}
                  image={val.image}
                  title={val.title}
                  price={val.price}
                  link={val.link}
                  quantityPrices={val.quantityPrices || []}
                  onAddFavorite={addToFav}
                />) :
                (status?.type === 'info' &&
                  Array(12).fill('').map(() => <Skeleton className={classNames('h-[375px] w-[211px] rounded-[8px] skeleton-bg')} />))}
            </InfiniteScroll>
          </div>
        )}
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
