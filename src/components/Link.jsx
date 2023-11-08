import React from "react";
import { ShareIcon } from "../icons";

import classNames, { clx } from "../utils/classTransform";

export function Link({ text, className, color = '#8C8B8A', href, ...others }) {

  return (
    <a
      href={href}
      className={clx(className, classNames(`${href ? 'underline' : 'cursor-default no-underline'} flex items-center mb-[8px] text-[12.7px] text-[#8C8B8A]`))}
      {...others}
    >
      {href && <ShareIcon height={'11.56px'} width={'11.56px'} color={color} />}
      <span className={classNames(href ? "ml-[6.44px]" : '')}>
        {text}
      </span>
    </a>
  );
}