import React from "react";
import { FavoriteIcon } from "../icons";
import classNames from "../utils/classTransform";

export function Item({ image, title, price, link, quantityPrices, onAddFavorite }) {
    const handleClick = (e, item) => {
        onAddFavorite(item)
        e.stopPropagation()
    }

    const handleOpen = () => {
        window.open(link, '_blank')
    }
    return (
        <div href={link} onClick={handleOpen} className={classNames(`grid p-[9px] h-[375px] bg-[#3F3E3B] w-[211px] cursor-pointer relative rounded-[8px]`)}>
            {(!!onAddFavorite) &&
                <div
                    className={classNames('absolute flex justify-between cursor-pointer top-[10px] right-[10px] h-[30px] z-20')}
                >
                    <div onClick={(e) => handleClick(e, {
                        url: link,
                        img: image,
                        price,
                        title
                    })}>
                        <FavoriteIcon width={'24px'} height={'30px'} color="#C9CED6" />
                    </div>
                </div>}
            <img className={classNames('h-[194px] rounded-[5px]')} src={image} loading="lazy" />
            <div className={classNames('text-[#fff] font-[700] text-[12px] leading-[17px] mt-[15px] mb-[15px]')}>{price}</div>
            <div className={classNames('h-[40px]')}>
                <div className={classNames('text-[#D9D9D9] underline')}>
                    <span className={classNames('item')}>
                        {title}
                    </span>
                </div>
            </div>
            <div className={classNames('grid w-[100%] h-[48.2px] grid-cols-auto-[64.28px] border-b-[1px] border-t-[1px] border-t-[#666666] border-b-[#666666]')}>
                <div className={classNames(`grid pl-[5px] pt-[5px] pb-[8px] h-[48.2px] w-[64.28px]`)}>
                    {!!quantityPrices[0] && <>
                        <p className={classNames(`text-[#C9CED6] text-[12px]`)}>
                            {'¥ ' + quantityPrices[0].valueString}
                        </p>
                        <p className={classNames(`text-[#C9CED6] text-[8px]`)}>
                            {quantityPrices[0].quantity}
                        </p>
                    </>}
                </div>
                <div className={classNames(`grid pl-[5px] pt-[5px] pb-[8px] h-[48.2px] w-[64.28px] border-l-[1px] border-r-[1px] border-l-[#666666] border-r-[#666666]`)}>
                    {!!quantityPrices[1] && <>
                        <p className={classNames(`text-[#C9CED6] text-[12px]`)}>
                            {'¥ ' + quantityPrices[1].valueString}
                        </p>
                        <p className={classNames(`text-[#C9CED6] text-[8px]`)}>
                            {quantityPrices[1].quantity}
                        </p>
                    </>}
                </div>
                <div className={classNames(`grid pl-[5px] pt-[5px] pb-[8px] h-[48.2px] w-[64.28px]`)}>
                    {!!quantityPrices[2] && <>
                        <p className={classNames(`text-[#C9CED6] text-[12px]`)}>
                            {'¥ ' + quantityPrices[2].valueString}
                        </p>
                        <p className={classNames(`text-[#C9CED6] text-[8px]`)}>
                            {quantityPrices[2].quantity}
                        </p>
                    </>}
                </div>
            </div>
        </div>
    );
}