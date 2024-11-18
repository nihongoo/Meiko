import { useEffect, useState } from "react";
import apiURL from "../../Routes/API";
import useFetchData from "../../customHook/useFetchData";
import ColorPicker from "./ColorPicker";

function Color({ onClose, onAddColor, colorSelect }) {
    const [selectedColors, setSelectedColors] = useState(colorSelect);
    const [colorPick, setColorPick] = useState(false)
    const [onChange, setOnChange] = useState(false)
    const handleColorSelect = (color) => {
        if (selectedColors.some(selected => selected.id === color.id)) {
            setSelectedColors(selectedColors.filter(selected => selected.id !== color.id));
        } else {
            setSelectedColors([...selectedColors, color]);
        }
    };

const handleDelColor = () => {
    try {
        
    } catch (error) {
        
    }
}

    const { data: colors } = useFetchData(apiURL.color.all, (rawData) =>
        rawData.map((item) => ({
            id: item.idColor,
            name: item.name,
        }))
    );
    useEffect(() => {
        onAddColor(selectedColors)
    }, [selectedColors, onAddColor])
    const handleChangeData = () => {
        setOnChange(!onChange);
    };
    const handleClose = () => {
        onClose()
    }
    return (
        <div className="position-absolute" style={{ zIndex: '5' }}>
            <div
                className="overlay position-fixed bg-dark"
                style={{
                    width: '100vw',
                    height: '100vh',
                    top: '0',
                    left: '0',
                    opacity: '0.5'
                }}
                onClick={handleClose}
            ></div>
            <div
                className="position-fixed border rounded-2 p-4"
                style={{
                    top: '18vh',
                    left: '37vw',
                    background: '#fff'
                }}
            >
                <div>
                    <h2 className="d-flex justify-content-center">Chọn màu</h2>
                    <div className="d-flex">
                        <div>
                            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                {colors.map((color) => (
                                    <div
                                        key={color.id}
                                        onClick={() => handleColorSelect(color)}
                                        style={{
                                            color: selectedColors.some(selected => selected.id === color.id) ? '#fff' : `${color.name}`,
                                            padding: '10px',
                                            margin: '5px',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                            border: selectedColors.some(selected => selected.id === color.id) ? `2px solid ${color.name}` : '2px solid',
                                            backgroundColor: selectedColors.some(selected => selected.id === color.id) ? `${color.name}` : '#fff'
                                        }}
                                        className="position-relative"
                                    >
                                        <span 
                                        className=" position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                                        onClick={handleDelColor}
                                        >
                                            x
                                        </span>
                                        {color.name}
                                    </div>
                                ))}
                            </div>

                        </div>
                        <div className="ms-4">
                            {colorPick && (
                                <ColorPicker onChange={handleChangeData} onClose={onClose} />
                            )}
                        </div>
                    </div>
                    <div className="d-flex justify-content-end mt-2">
                        <button
                            onClick={handleClose}
                            className="btn btn-outline-danger me-2"
                        >Hủy</button>
                        <button
                            className="btn btn-outline-success"
                            onClick={() => {
                                setColorPick(!colorPick)
                            }}
                        >Thêm</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Color;