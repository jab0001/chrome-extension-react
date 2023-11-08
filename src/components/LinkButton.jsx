import React from "react";

import classNames, { clx } from "../utils/classTransform";

export function LinkButton({ children, onClick, className }) {

  return (
    <button onClick={onClick} className={clx(className, classNames('underline uppercase text-[11px]'))}>
      {children}
    </button>
  );
}