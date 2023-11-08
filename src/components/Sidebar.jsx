import React, { useEffect, useState } from "react";
import classNames, { clx } from "../utils/classTransform";

export function Sidebar({ children, open, setOpen, className, startPic, sidebarMenu, isLeftHide = false, showMenu = false }) {

  const transition = isLeftHide ? (open ? 'left-0 opacity-1' : 'left-[-100%] opacity-0') : (open ? 'translate-x-0' : 'translate-x-[-100%]')

  return (
    <>
      <div onClick={() => setOpen(!open)} className={clx(className, classNames(`max-md:hidden fixed z-[100000000] top-0 bottom-0 ${transition} bg-[#2d2d2d6b] ${isLeftHide ? 'w-[100%]' : 'left-0 right-0'}`))}>
      </div>
      <div className={classNames(`max-md:hidden transition-all fixed z-[1000000000] top-0 bottom-0 ${transition} bg-[#292824] rounded-br-[12px] rounded-tr-[12px] ${className}`)}>
        <div className={classNames(`w-[100%] h-[100%] relative flex flex-col`)}>
          {children}
          {showMenu && (
            <>
              {sidebarMenu && (
                <div className={classNames('absolute left-[calc(100%+13px)] top-[15%]')}>
                  {sidebarMenu}
                </div>)}
              {/* <div className={classNames('absolute left-[100%] top-[50%] cursor-pointer')} onClick={() => setOpen(!open)}>
                <div className={classNames('w-[40px] h-[30px] rounded-r-[10px] bg-[#2D2D2D] flex justify-center items-center')}>
                  <img className={classNames('w-[24px] h-[24px]')} src={startPic} />
                </div>
              </div> */}
            </>
          )}

        </div>
      </div>
    </>

  );
}
