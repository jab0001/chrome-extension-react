import React from "react";
import classNames from "../utils/classTransform";

export function SortingButton({ title, onClick, active, direction }) {
    const activeStyle = 'bg-[#F5DD6D] cursor-pointer text-black text-base py-[8px] px-[16px] rounded-full';
    const defaultStyle = 'border border-solid border-gray-300 cursor-pointer text-white text-base py-[8px] px-[16px] rounded-full';
    return (
        <div
            onClick={() => onClick()}
            className={classNames(active ? activeStyle : defaultStyle)}
        >{title} {active && (direction == 'desc' ? '↑' : '↓')}</div>
    );
}
