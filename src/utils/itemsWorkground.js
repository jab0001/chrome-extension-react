import * as Sentry from "@sentry/react";

export const getInChinaDeliveryCost = async () => {
    const [{result}] = await chrome.scripting.executeScript({
        func: () => {
            const node = document.querySelector(".logistics-express-price");

            return (node && +node.textContent) || 0;
        },
        args: [],
        target: {
            tabId: await getTabId(),
        },
        world: "MAIN",
    });
    return result;
};

export const getSellerData = async () => {
    const [{result}] = await chrome.scripting.executeScript({
        func: () => {
            const getReactElement = (dom) => {
                return dom[
                    Object.keys(dom).find(
                        (key) =>
                            key.startsWith("__reactInternalInstance$") ||
                            key.startsWith("__reactFiber$")
                    )
                    ];
            };

            const node = getReactElement(document.querySelector("#hd_0_container_0"));
            const ret = node.memoizedProps.children[0].props.module.moduleData;
            ret.sellerPage = 'https://' + node.memoizedProps.children[0].props.globalData?.domain;
            return ret;
        },
        args: [],
        target: {
            tabId: await getTabId(),
        },
        world: "MAIN",
    });
    console.log(result)

    return result;
};


export const getOfferData = async () => {
    const [{result}] = await chrome.scripting.executeScript({
        func: () => {
            const getReactElement = (dom) => {
                return dom[
                    Object.keys(dom).find(
                        (key) =>
                            key.startsWith("__reactInternalInstance$") ||
                            key.startsWith("__reactFiber$")
                    )
                    ];
            };

            const skusSelectors = [
                '.detail-affix-sku-wrapper',
                '.style-custom-sku-wrapper'
            ]

            const getSkusOfferData = (node) => {
                const children = node.memoizedProps.children

                if (Array.isArray(children)) {
                    return children.find(child => child?.ref?.current != null).ref.current.getSkuIns()
                }
                return children.ref.current.getSkuData()
            }


            let errors = []

            for (let selector of skusSelectors) {
                let element = document.querySelector(selector)
                try {
                    if (!element)
                        throw Error(`${selector} not be find`)

                    let node = getReactElement(element)
                    let offerData = getSkusOfferData(node)
                    if (offerData == null) {
                        throw Error(`${selector} cant find skus offer data`)
                    }
                    return offerData
                } catch (error) {
                    errors.push(error)
                }
            }

            throw AggregateError(errors)
        },
        args: [],
        target: {
            tabId: await getTabId(),
        },
        world: "MAIN",
    });
    return result;
};

export const getPageVar = async (name) => {
    const [{result}] = await chrome.scripting.executeScript({
        func: (name) => window[name],
        args: [name],
        target: {
            tabId: await getTabId(),
        },
        world: "MAIN",
    });
    return result;
};

export const getTabUrl = async () => {
    var tabs = await chrome.tabs.query({active: true, currentWindow: true});
    return (tabs[0].url || "").split("?")[0];
};

const getTabId = async () => {
    return (await getTab()).id;
};

const getTab = async () => {
    var tabs = await chrome.tabs.query({active: true, currentWindow: true});
    return tabs[0];
};

const getSelectedSkus = (offerData) => {
    const {skuPannelInfo, skuModel, globalData, skuState} = offerData;

    // models
    const {tempModel} = globalData;
    const {skuInfoMap} = skuModel;

    // selected
    const {_selected} = skuPannelInfo;
    const {selectedSku} = _selected;


    if (Object.keys(selectedSku).length) {
        return Object.keys(selectedSku).map((specId) => ({
            count: selectedSku[specId],
            price: +_selected.priceActive,
            ...Object.values(skuInfoMap).find((infoMap) => infoMap.specId == specId),
        }));
    } else {
        return [
                {
                    "count": _selected.total.count,
                    "price": +_selected.priceActive,
                    "canBookCount": skuState.productExtendInfo.canBookedAmount,
                    "discountPrice": _selected.priceActive,
                    "firstProp": tempModel.offerTitle,
                    "isPromotionSku": true,
                    "name": tempModel.offerTitle,
                    "retailPrice": "",
                    "saleCount": tempModel.saledCount,
                    "secondProp": "",
                    "skuId": tempModel.offerId,
                    "specAttrs": tempModel.offerTitle,
                    "specId": tempModel.offerId
                }
            ]
    }
};

const getSelectedModel = (offerData) => {
    const {skuPannelInfo, skuModel, globalData, skuState} = offerData;

    // models
    const {images, tempModel} = globalData;


    // selected
    const {_selected} = skuPannelInfo;

    if (Object.keys(skuModel.skuInfoMap).length) {
        Object.keys(skuModel.skuInfoMap).forEach((sku_id) => {
            const item = skuModel.skuInfoMap[sku_id];
            item.price = item.price || +_selected.priceActive;
        });
        return skuModel
    } else {
        return {
            "skuInfoMap": {
                [tempModel.offerTitle]: {
                    "canBookCount": skuState.productExtendInfo.canBookedAmount,
                    "discountPrice": _selected.priceActive,
                    "firstProp": tempModel.offerTitle,
                    "isPromotionSku": true,
                    "name": tempModel.offerTitle,
                    "price": _selected.priceActive,
                    "retailPrice": "",
                    "saleCount": tempModel.saledCount,
                    "secondProp": "",
                    "skuId": tempModel.offerId,
                    "specAttrs": tempModel.offerTitle,
                    "specId": tempModel.offerId
                }
            },
            "skuInfoMapOriginal": {
                [tempModel.offerTitle]: {
                    "canBookCount": skuState.productExtendInfo.canBookedAmount,
                    "discountPrice": _selected.priceActive,
                    "isPromotionSku": true,
                    "price": _selected.priceActive,
                    "saleCount": tempModel.saledCount,
                    "skuId": tempModel.offerId,
                    "specAttrs": tempModel.offerTitle,
                    "specId": tempModel.offerId
                }
            },
            "skuPriceScale": skuModel.skuPriceScale,
            "skuPriceScaleOriginal": skuModel.skuPriceScale,
            "skuProps": [
                {
                    "fid": 1,
                    "prop": "",
                    "value": [
                        {
                            "imageUrl": images[0].fullPathImageURI,
                            "name": tempModel.offerTitle
                        }
                    ]
                }
            ]
        }
    }

}

export const getItems = async () => {
    const offerData = await getOfferData();

    const {skuPannelInfo, globalData} = offerData;

    const inchina = await getInChinaDeliveryCost();
    // models
    const {images, tempModel} = globalData;
    const img = images[0].fullPathImageURI;
    const title = tempModel.offerTitle;

    // selected
    const {_selected} = skuPannelInfo;

    const skus = getSelectedSkus(offerData)
    const skuModel = getSelectedModel(offerData)


    const newItem = {
        url: await getTabUrl(),
        version: 2,
        img,
        title,
        skus,
        skuModel,
        inchina,
        count: +_selected.total.count,
        amount: skus.reduce(
            (a, sku) =>
                +a +
                +sku.count *
                +(sku.discountPrice || sku.price || +_selected.priceActive),
            0
        ),
    };

    return {totalPrise: _selected.total.price, newItem};
};


