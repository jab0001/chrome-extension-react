import React from "react";

import { BinIcon, CartIcon } from "../icons";
import classNames from "../utils/classTransform";
import { Link } from "./Link";
import { LinkButton } from "./LinkButton";

export function FavoriteItem({ image, title, price, link, onRemove }) {
    return (
        <div className={classNames(`flex p-[8px] h-[101px] bg-[#3F3E3B] w-[397px] rounded-[8px] ${!!onRemove && 'relative'}`)}>
            {!!onRemove && <div
                onClick={onRemove}
                className={classNames('absolute cursor-pointer bottom-[13px] right-[22.3px] h-[15px] w-[15px]')}
            >
                <BinIcon width={'11.7px'} height={'15px'} color="#C9CED6" />
            </div>}
            <img className={classNames('h-[77px] w-[77px] mr-[13px] rounded-[5.7px]')} src={image} />
            <div>
                <Link href={link} target="_blank" text={title} className={classNames('mb-[15px] text-[#8C8B8A]')} />
                <div className={classNames('text-[#C9CED6] font-[700] text-[14px] leading-[17px] mb-[6px]')}>{price}</div>
            </div>
        </div>
    );
}