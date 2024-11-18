import React, { useState } from 'react';
import { ChromePicker } from 'react-color';
import apiURL from '../../Routes/API';
import { toast } from 'react-toastify';

function ColorPicker({onClose }) {
    const [color, setColor] = useState('#7D4141');

    const handleChangeComplete = (color) => {
        setColor(color.hex);
    };

    const handleAddColor = async () => {
        const obj = {
            name: color,
            status: 1
        };

        try {
            const res = await fetch(apiURL.color.create, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(obj)
            });

            if (!res.ok) {
                throw new Error('Failed to add color');
            }
            toast.success('Thêm màu mới thành công');
            onClose()
        } catch (error) {
            toast.error('Có lỗi xảy ra khi thêm màu');
        }
    };

    return (
        <div>
            <ChromePicker
                color={color}
                onChangeComplete={handleChangeComplete}
            />
            <div className='d-flex mt-2'>
                <div className='d-flex align-items-center'>
                    <p className='m-0'>{color}</p>    
                </div>
                <div
                    style={{
                        padding: '10px',
                        margin: '5px',
                        borderRadius: '5px',
                        backgroundColor: color,
                        width: '85px'
                    }}
                />
                <button 
                    className='btn'
                    onClick={handleAddColor}
                >
                    <i className="text-success fa-regular fa-circle-check fa-xl"></i>
                </button>
            </div>
        </div>
    );
}

export default ColorPicker;