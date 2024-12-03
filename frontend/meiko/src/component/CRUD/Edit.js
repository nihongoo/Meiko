import { memo, useEffect, useState } from "react";
import { toast } from "react-toastify";

const Edit = memo(({ apiURL, onClose, obj, onChangeData }) => {
    const [formData, setFormData] = useState({});
    useEffect(() => {
        const {serialNumber,id, ...rest} = obj
        setFormData(rest);
    }, [obj]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEdit = async () => {
        try {
            const response = await fetch(apiURL, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                toast.success('Sửa thành công');
                onChangeData();
                onClose();
            } else {
                toast.error('Sửa thất bại');
                throw new Error("Lỗi");
            }
        } catch (error) {
            toast.error('Sửa thất bại');
            console.log(error);
        }
    };

    return (
        <div style={{ zIndex: '5' }}>
            <div
                className="overlay position-fixed bg-dark"
                onClick={onClose}
                style={{
                    width: '100vw',
                    height: '100vh',
                    top: '0',
                    left: '0',
                    opacity: '0.5'
                }}
            ></div>
            <div
                className="position-absolute top-50 start-50 translate-middle border rounded-2 p-4"
                style={{
                    width:'500px',
                    background: '#fff'
                }}
            >
                <div>
                    <h2 className="d-flex justify-content-center">Sửa</h2>
                    {Object.entries(formData).map(([key, value]) => (
                        <div key={key} className="mb-3">
                            <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                            <input
                                type="text"
                                name={key}
                                value={value}
                                onChange={handleChange}
                                required
                                className="form-control"
                            />
                        </div>
                    ))}
                    <div className="d-flex justify-content-end mt-2">
                        <button
                            onClick={onClose}
                            className="btn btn-outline-danger me-2"
                        >Hủy</button>
                        <button
                            className="btn btn-outline-warning"
                            onClick={handleEdit}
                        >Sửa</button>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default Edit;