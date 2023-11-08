
import React from "react";
import classNames, { clx } from "../utils/classTransform";

export function SimpleDivider({ vetical = false, className }) {

  return (
    <div className={clx(className, classNames(`${vetical ? 'w-[1px]' : 'h-[1px]'} bg-[#ffffff10]`))}></div>
  );
}