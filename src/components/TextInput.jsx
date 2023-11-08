import React from 'react';
import classNames from '../utils/classTransform';

export const TextInput = ({ name, value, onChange, placeholder }) => {
    const handleInputChange = (event) => {
        onChange(event.target.value);
    };

    return (
        <input
            className={classNames('bg-[#3F3E3B] px-[14px] py-[10px] rounded-[5px] text-[14px] w-full')}
            type="text"
            value={value}
            name={name}
            onChange={handleInputChange}
            placeholder={placeholder}
        />
    );
}; 