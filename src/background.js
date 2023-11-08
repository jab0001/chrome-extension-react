import md5 from 'js-md5'

import { getItems, getOfferData, getPageVar, getSellerData } from './utils/itemsWorkground';

const inDev = false;

import * as Sentry from "@sentry/react";

function checkCookie(name) {
    return new Promise((resolve, reject) => {
        chrome.cookies.getAll({
            name: name
        },
            function (cookie) {
                if (cookie) {
                    const coo = cookie.sort((a, b) => (b?.expirationDate || 0) - (a?.expirationDate || 0));
                    resolve(coo)
                } else {
                    console.log('Can\'t get cookie! Check the name!')
                    reject(0);
                }
            })
    }).catch(Sentry.captureException);
}

const retryGetImageMax = 8;
const retryGetImagesMax = 8;

async function getImgData(imageBase64, times = 1, tokenNum = 0) {
    const time = new Date().getTime();
    const token = await checkCookie('_m_h5_tk').then((cookie) => cookie);

    if (token.length < 1) {
        return null;
    }

    const tokenFormat = token[tokenNum]?.value.split('_');

    const dataToSend = JSON.stringify({
        imageBase64: imageBase64.split(",").pop(),
        appName: "searchImageUpload",
        appKey: "pvvljh1grxcmaay2vgpe9nb68gg9ueg2"
    });

    const signStr = md5(tokenFormat[0] + '&' + time + '&' + '12574478' + '&' + dataToSend);

    try {
        const sendedImageInfo = await fetch("https://h5api.m.1688.com/h5/mtop.1688.imageservice.putimage/1.0/?" + new URLSearchParams({
            jsv: '2.4.11',
            appKey: 12574478,
            t: time,
            sign: signStr,
            api: 'mtop.1688.imageService.putImage',
            ecode: 0,
            v: '1.0',
            type: 'originaljson',
            dataType: 'jsonp',
            '_bx-v': '1.1.20'
        }), {
            "headers": {
                "accept": "application/json",
                "content-type": "application/x-www-form-urlencoded",
            },
            "referrer": "https://s.1688.com/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": 'data=' + encodeURIComponent(dataToSend),
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        });

        const { data: imageData } = await sendedImageInfo.json();
        if (!imageData && tokenNum + 1 > token.length) {
            sendToCurrent((tab) => chrome.tabs.sendMessage(tab, {
                action: "send_status",
                status: { type: 'info', text: `Загрузка изображения: попытка ${times + 1}` }
            }, function (response) {
            }));
            return await getImgData(imageBase64, times + 1, tokenNum + 1)
        }

        return imageData
    } catch (e) {
        if (retryGetImageMax < times) {
            sendToCurrent((tab) => chrome.tabs.sendMessage(tab, {
                action: "send_status",
                status: { type: 'info', text: `Загрузка изображения: попытка ${times + 1}` }
            }, function (response) {
            }));
            return await getImgData(imageBase64, times + 1, tokenNum)
        }
        return true;
    }
}

function sendToCurrent(callback) {
    chrome.tabs.query(
        { currentWindow: true, active: true },
        (tabArray) => callback(tabArray[0].id)
    );
}

async function getImges(beginPage, imageId, requestId, sessionId, sorting, times = 1) {
    try {
        const foundedVariants = await fetch("https://search.1688.com/service/imageSearchOfferResultViewService?" + new URLSearchParams({
            tab: 'imageSearch',
            imageAddress: '',
            imageId,
            spm: '',
            imageIdList: imageId,
            sortField: sorting.field,
            sortType: sorting.type,
            beginPage,
            pageSize: 40,
            requestId,
            pageName: 'image',
            sessionId,
            '_bx-v': '1.1.20'
        }),
            {
                "headers": {
                    "accept": "application/json, text/plain, */*",
                },
                "referrer": "https://s.1688.com/",
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": null,
                "method": "GET",
                "mode": "cors",
                "credentials": "include"
            });

        const result = await foundedVariants.json();

        if (result && result.rgv587_flag === "sm") {
            return {
                name: 'capcha',
                url: result.url
            }
        } else {
            const { data: { data: returnedData } } = result
            return returnedData
        }
    } catch (e) {
        if (retryGetImagesMax < times) {
            sendToCurrent((tab) => chrome.tabs.sendMessage(tab, {
                action: "send_status",
                status: { type: 'info', text: `Загрузка результата: попытка ${times + 1}` }
            }, function (response) {
            }));
            return await getImges(beginPage, imageId, requestId, sessionId, sorting, times + 1)
        }
        return true;
    }
}

const savedata = (key, data) => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.set({ [key]: data }, () => {
            if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
            else resolve();
        });
    }).catch(Sentry.captureException);
};

const loaddata = (key) => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(key, (data) => {
            const result = data[key] || null;
            if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
            else resolve(result);
        });
    }).catch(Sentry.captureException);
};

// Getting
const doAsync = async (request) => {
    const base_url = inDev ? "http://localhost:3000" : "https://api.flg-platform.com";

    let response;

    try {
        switch (request.message) {
            case "get_current":
                const { globalData } = await getOfferData();

                await savedata('cart', state);

                response = { data: globalData };
                break;
            case "check_cookie":
                response = { has: await checkCookie('_m_h5_tk').then((coo) => coo.length > 0) };
                break;
            case "store_cart":
                const { state } = request;
                await savedata('cart', state);

                response = { message: "stored", date: new Date() };
                break;
            case "add_from_page":
                const { totalPrise, newItem } = await getItems();

                if (!totalPrise) {
                    response = { error: "no items" };
                    break;
                }

                const loadedStateRaw = await loaddata('cart');
                const loadedState = loadedStateRaw ? JSON.parse(loadedStateRaw) : [];

                const result = [
                    ...((loadedState && loadedState.filter((i) => i.url != newItem.url)) || []),
                    newItem,
                ];
                await savedata('cart', JSON.stringify(result));

                response = { message: "stored" };
                break;

            case "add_fav":
                const { newItem: newItemFav } = await getItems();

                const loadedStateFavRaw = await loaddata('favorite');
                const loadedStateFav = loadedStateFavRaw ? JSON.parse(loadedStateFavRaw) : [];

                const resultFav = [
                    ...((loadedStateFav && loadedStateFav.filter((i) => i.url != newItemFav.url)) || []),
                    {
                        url: newItemFav.url,
                        img: newItemFav.img,
                        price: newItemFav.skuModel.skuPriceScale,
                        title: newItemFav.title
                    },
                ];

                await savedata('favorite', JSON.stringify(resultFav));

                response = { message: "stored" };
                break;
            case "store_favorite":
                const { favorite } = request;
                await savedata('favorite', favorite);

                response = { message: "stored", date: new Date() };
                break;
            case "retrieve_seller":
                const react_data = await getSellerData();
                const store_var = react_data || (await getPageVar("__commonHeader__"));

                response = { message: "stored", result: store_var };
                break;
            case "retrieve_cart":
                const loaded_state = await loaddata('cart');
                if (!loaded_state) {
                    await savedata('cart', JSON.stringify([]));
                }
                response = { message: "retrieved", state: loaded_state || JSON.stringify([]) };
                break;
            case "retrieve_favorite":
                const loaded_favorite = await loaddata('favorite');
                if (!loaded_favorite) {
                    await savedata('favorite', JSON.stringify([]));
                }
                response = { message: "retrieved", state: loaded_favorite || JSON.stringify([]) };
                break;
            case "open_sidebar":
                sendToCurrent((tab) => chrome.tabs.sendMessage(tab, {
                    action: "open_sidebar",
                    tab: request.tab
                }, function (response) {
                }));
                break;
            case "send_image_1688":
                const { imageBase64 } = request;
                const imageData = await getImgData(imageBase64);
                response = imageData;
                break;
            case "return_1688":
                const { beginPage, imageId, requestId, sessionId, sorting } = request;

                const returnedData = await getImges(beginPage, imageId, requestId, sessionId, sorting)
                response = returnedData;
                break;
            case "viewport_image":
                const capturing = await chrome.tabs.captureVisibleTab({ format: 'png' });

                response = { image: capturing };
                break;
            case "process_to_platform":
                const { items } = request;

                const platform_response = await fetch(
                    `${base_url}/api/v1/orders/extension`,
                    { method: "POST", body: items, headers: { "Content-Type": "application/json" } }
                );

                const { data: { temp_id } } = await platform_response.json();

                if (!temp_id) throw "Got no id";

                chrome.tabs.create({
                    url: `https://flg-platform.com/new_order?ext_id=${temp_id}`,
                    active: true,
                });

                response = { ok: "ok" };
                break

            default:
                throw new Error("unknown");
        }
    } catch (error) {
        Sentry.captureException(error);
        response = {
            error: JSON.stringify(error),
        };
    }
    return response;
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    doAsync(request).then(sendResponse).catch(Sentry.captureException);
    return true;
});


var contextFLG = {
    id: 'flg',
    "title": "FLG поиск по фото",
    "contexts": ["all"],
};

var contextfindByImage = {
    id: 'flgFindByImage',
    parentId: 'flg',
    "title": "Найти по изображению",
    "contexts": ["all"],
};

var contextfindByArea = {
    id: 'flgFindByArea',
    parentId: 'flg',
    "title": "Выделить товар",
    "contexts": ["all"],
};

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create(contextFLG);
    chrome.contextMenus.create(contextfindByArea);
    chrome.contextMenus.create(contextfindByImage);
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
    switch (info.menuItemId) {
        case 'flgFindByImage':
            chrome.tabs.sendMessage(tab.id, {
                action: "search_by_picture",
                img: info?.mediaType === 'image' ? info.srcUrl : null
            }, function (response) {
            });
            break;
        case 'flgFindByArea':
            chrome.tabs.sendMessage(tab.id, { action: "search_by_area" }, function (response) { });
            break;
        default:
            break;
    }
});

chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let [key, { newValue }] of Object.entries(changes)) {
        if (namespace === 'local') {
            sendToCurrent((tab) => chrome.tabs.sendMessage(tab, {
                action: "storage_changed",
                key,
                value: newValue
            }, function (response) {
            }));
        }
    }
});
