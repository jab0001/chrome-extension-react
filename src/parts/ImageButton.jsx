import React, { useEffect, useState, useRef } from "react";
import classNames from "../utils/classTransform";

export function ImageButton({ handleClick }) {
    const inputEl = useRef(null);
    const [currentPic, setCurrentPic] = useState(null)
    const [currentPicSrc, setCurrentPicSrc] = useState(null)

    useEffect(() => {
        const func = (e) => {
            if (currentPic) {
                const pos = currentPic.getBoundingClientRect()
                if (e.clientX < pos.x || e.clientX > pos.right || e.clientY < pos.y || e.clientY > pos.bottom) {
                    inputEl.current.classList.add(classNames('hidden'))
                    setCurrentPic(null)
                }
            }
        };
        document.addEventListener("mousemove", func)
        return () => {
            document.removeEventListener("mousemove", func)
        }
    }, [currentPic])

    useEffect(() => {
        const min = 80

        let observer = new MutationObserver(mutations => {
            for (let mutation of mutations) {
                for (let addedNode of mutation.addedNodes) {
                    if (addedNode.nodeName === "IMG") {
                        let size = addedNode.getBoundingClientRect()
                        if (size.width > min && size.height > min) {
                            addedNode.addEventListener("mouseenter", (e) => {
                                const pos = e.target.getBoundingClientRect()
                                setCurrentPic(e.target)
                                setCurrentPicSrc(e.target.src)

                                inputEl.current.classList.remove(classNames('hidden'))
                                inputEl.current.style.left = `${pos.x}px`
                                inputEl.current.style.top = `${pos.y + window.pageYOffset}px`
                            });
                        }
                    }
                }
            }
        });

        observer.observe(document, { childList: true, subtree: true });

        window.addEventListener('load', function () {
            setTimeout(() => {
                const items = document.getElementsByTagName("img");
                const items1 = document.querySelectorAll("div img");

                const items_array = [...items, ...items1];

                items_array.forEach((item) => {
                    let size = item.getBoundingClientRect()

                    if (size.width > min && size.height > min) {
                        item.addEventListener("mouseenter", (e) => {
                            const pos = e.target.getBoundingClientRect()
                            setCurrentPic(e.target)
                            setCurrentPicSrc(e.target.src)

                            inputEl.current.classList.remove(classNames('hidden'))
                            inputEl.current.style.left = `${pos.x}px`
                            inputEl.current.style.top = `${pos.y + window.pageYOffset}px`
                        });
                    }
                })
            }, 1000)
        })
    }, [])

    return (
        <div ref={inputEl} onClick={() => handleClick(currentPicSrc)} className={classNames('absolute text-[small] font-[500] group m-[10px] hidden z-[50000000]')}>
            <button className={classNames('transition-[width] transform duration-600 bg-[#2D2D2D] text-[#FADD56] flex rounded-[50px] w-[35px] group-hover:w-[105px]')}>
                <div className={classNames('m-[8px]')}>
                    <svg viewBox="0 0 50 50" fill="#FADD56" width="20px" height="20px"><path d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z" />
                    </svg>
                </div>
                <div className={classNames('transition-opacity transform group-hover:opacity-100 ml-[5px] self-center mr-[10px] opacity-0 group-hover:delay-200')}>
                    Search
                </div>
            </button>
        </div>
    );
}
