import React, { useState, useRef } from 'react';

import classNames from '../utils/classTransform';
import { getBase64ImageParams } from '../utils/imageUtil';
import { Button } from '../components/Button';
import { SearchIcon } from "../icons";
import * as Sentry from "@sentry/react";

const AreaSelector = ({ onClose, onTakePicture }) => {
  const [startCoords, setStartCoords] = useState({ x: 0, y: 0 });
  const [endCoords, setEndCoords] = useState({ x: 0, y: 0 });
  const [isSelecting, setIsSelecting] = useState(false);
  const [isStartSelecting, setIsStartSelecting] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const containerRef = useRef(null);

  const handleMouseDown = (e) => {
    setIsSelecting(true);
    setIsSelected(false);
    setStartCoords({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isSelecting)
      return;

    if (!isStartSelecting)
      setIsStartSelecting(true);

    setEndCoords({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
    setIsSelected(true);
    setIsStartSelecting(false);
  };

  let left = Math.min(startCoords.x, endCoords.x);
  let top = Math.min(startCoords.y, endCoords.y);
  let width = Math.abs(startCoords.x - endCoords.x);
  let height = Math.abs(startCoords.y - endCoords.y);

  let rectangleStyle = {
    position: "absolute",
    left: `${left}px`,
    top: `${top}px`,
    width: `${width}px`,
    height: `${height}px`,
    boxShadow: '0px 0px 0px 4000px rgba(0,0,0, 0.7)',
    border: '2px solid #FFD200'
  };

  let buttomStyle = {
    position: "fixed",
    left: `${left}px`,
    top: `${top + height}px`,
  };

  const bRadius = 0;
  const eOffset = 4;

  const handleScreenshot = () => {
    chrome.runtime.sendMessage(
      { message: "viewport_image" },
      ({ image, error }) => {
          getBase64ImageParams(image, left + eOffset, top + eOffset, width - eOffset * 2, height - eOffset * 2).then((image) => onTakePicture(image))
      }
    );
  };
  const onKeyEnter = (e) => {
    if (e.key === 'Enter') {
      handleScreenshot();
    }
  }
  return (
    <>
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onKeyDown={onKeyEnter}
        className={classNames('fixed top-[0] left-[0] w-[100%] h-[100%] z-[100000000]')}
        style={{ cursor: `url(${chrome.runtime.getURL('/assets/cursor.png')}) 16 16, pointer`, ...(!isSelected ? {} : {}), ...(isStartSelecting || isSelected) ? {} : { backgroundColor: "rgba(0, 0, 0, 0.7)" } }}
      >
        {(isSelected || (isSelecting && isStartSelecting)) && <div
          ref={containerRef}
          style={{ ...rectangleStyle, ...(isSelected ? { borderRadius: `${bRadius}px` } : { backgroundColor: "rgba(0, 0, 0, 0.1)", }) }}
        >
          <span className={classNames('absolute top-[-5px] left-[-5px] w-[8px] h-[8px] bg-[#FFD200]')} />
          <span className={classNames('absolute bottom-[-5px] right-[-5px] w-[8px] h-[8px] bg-[#FFD200]')} />
        </div>}
      </div>
      {isSelected &&
        <div className={classNames('flex justify-end gap-[16px] items-center p-[16px] mt-[24px] rounded-[8px] bg-[#292824] z-[1000000000]')} style={buttomStyle}>
          <Button className={classNames('px-[14px] w-min-[150px]')} onClick={handleScreenshot}>
            <SearchIcon height={'15px'} width={'15px'} color={'black'} />
            <p>
              Найти товар
            </p>
          </Button>
          {/* <p className={classNames('text-gray-300 max-w-[100px]')}>
            или нажмите клавишу “Ввод” на клавиатуре
          </p> */}
          <button className={classNames('ml-[14px] text-gray-100 underline')} onClick={onClose}>Отменить</button>
        </div>
      }
    </>
  );
};

export default AreaSelector;