import React, { useEffect, useState } from "react";
import classNames, { clx } from "../utils/classTransform";

export function IconButton({ children, onClick, className, badge = null, badgeSize = 'sm' }) {
  const sizes = {
    sm: 'h-[24.3px] w-[24.3px] text-[10.3px] top-[-5px] right-[-10px]',
    sx: 'h-[20px] w-[20px] text-[10px] top-0 right-[8px]'
  }
  return (
    <div onClick={onClick} className={clx(className, classNames('flex justify-center items-center cursor-pointer relative'))}>
      {badge && <div
        style={{ background: 'linear-gradient(180deg, #F56D6D 0%, #FD3B81 100%)' }}
        className={classNames(`absolute flex items-center justify-center rounded-[50%] text-[white] ${sizes[badgeSize]}`)}
      >
        {badge}
      </div>}
      {children}
    </div>
  );
}