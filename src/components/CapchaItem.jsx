import React from "react";
import classNames from "../utils/classTransform";
import { Button } from './Button';

export function CapchaItem({ link }) {
    return (
        <div className={classNames('w-[100%] flex-row flex-nowrap flex-shrink flex-grow')}>
            <p className={classNames('text-white text-base w-[100%]')} style="margin-bottom: 20px; margin-top: 20px; text-align: center;
    color: red;">Для дальнейшей работы необходимо пройти капчу</p>
            <div style="width: fit-content;
    margin: 0 auto;">
                <Button onClick={() => {
                    window.open(`https://search.1688.com${link}`, '_blank');
                }}>Перейти</Button>
            </div>
        </div>
    );
}