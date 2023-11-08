import React from "react";

import classNames, { clx } from "../utils/classTransform";

export function Button({ children, onClick, className, outline, enabled }) {

  const disabled = !(enabled ?? true);

  return (
    <button
      disabled={disabled}
      style={outline ?
        {
          border: '1px solid #C9CED6',
          color: disabled ? '#9F9F9F' : '#C9CED6',
          textDecoration: 'underline',
          height: 'auto',
          minHeight: '35px',
          padding: '0 10px',
        } :
        {
          background: disabled ? 'linear-gradient(rgb(232 229 211) 0%, rgb(196 195 195) 100%)' : 'linear-gradient(180deg, #F5DD6D 0%, #FFCD4D 100%)',
          color: disabled ? '#9F9F9F' : '#292929',
          padding: '0 10px',
          minHeight: '35px',
        }
      } onClick={onClick} className={clx(className, classNames('flex items-center justify-center gap-[8px] text-[#292929] rounded-[6px] h-[44px]'))}>
      {children}
    </button>
  );
}