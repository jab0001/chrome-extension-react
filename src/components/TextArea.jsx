import React from 'react';
import classNames from '../utils/classTransform';

export const TextArea = ({ name, value, onChange, placeholder, rows, cols }) => {
    const handleInputChange = (event) => {
        onChange(event.target.value);
    };

    return (
        <textarea
            className={classNames('bg-[#3F3E3B] resize-none px-[14px] py-[10px] rounded-[5px] text-[14px] w-full')}
            type="text"
            name={name}
            onChange={handleInputChange}
            placeholder={placeholder}
            rows={rows ?? 4} // You can adjust the number of rows as needed
            cols={cols ?? 50}
        >
            {value}
        </textarea>
    );
}; 