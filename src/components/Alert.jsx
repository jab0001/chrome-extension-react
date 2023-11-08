

import React from "react";
import classNames from "../utils/classTransform";

export function Alert({ type = 'loader', text = '' }) {

    return (
        <div className={classNames(`m-[5px] h-[30px] rounded-[50px] ${type === 'loader' ? 'w-[30px]' : 'p-[6px]'} ${type === 'alert' ? 'bg-rose-500' : 'bg-[#474747]'}`)}>
            {type === 'loader' ?
                (<svg className={classNames('animate-spin h-[30px] w-[30px]')} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle stroke="#FADD56" className={classNames('opacity-25')} cx="12" cy="12" r="10" fill="#474747" stroke-width="4">
                    </circle>
                    <path className={classNames('opacity-75')} fill="#FADD56" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                </svg>) :
                (<div className={classNames(`inline-block align-middle ${type === 'alert' ? 'text-zinc-900' : 'text-[#FADD56]'}`)}>
                    {text}
                </div>)}
        </div>

    );
}