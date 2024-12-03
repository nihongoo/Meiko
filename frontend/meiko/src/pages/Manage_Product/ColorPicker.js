import React, { useState } from 'react';
import { ChromePicker } from 'react-color';
import apiURL from '../../routes/API/index.js';
import { toast } from 'react-toastify';

function ColorPicker({ onClose }) {
    const [obj, setObj] = useState({
        name: '',
        hex: '#7D4141',
        status: 1
    })

    const handleChangeComplete = (color) => {
        setObj(prev => ({
            ...prev,
            hex: color.hex
        }))
    };

    const handleAddColor = async () => {
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
                color={obj.hex}
                onChangeComplete={handleChangeComplete}
            />
            <div className='d-flex mt-2'>
                <div>
                    <div className='d-flex align-items-center'>
                        <input
                            placeholder='Nhập tên cho màu'
                            onChange={(e) => setObj((prev) => ({
                                ...prev,
                                name: e.target.value
                            }))}
                        />
                    </div>
                    {/* <div
                    style={{
                        padding: '10px',
                        margin: '5px',
                        borderRadius: '5px',
                        backgroundColor: obj.hex,
                        width: '85px'
                    }}
                /> */}
                </div>
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