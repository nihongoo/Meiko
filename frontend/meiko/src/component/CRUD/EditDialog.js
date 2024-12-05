import { Dialog, TextField, Button } from "@mui/material";
import { useState, useEffect } from "react";

function EditDialog({ open, onClose, item, onUpdate }) {
    const [name, setName] = useState('');

    useEffect(() => {
        if (item) {
            setName(item.name);
        }
    }, [item]);

    const handleUpdate = () => {
        onUpdate({ ...item, name });
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
            <div className="p-3">
                <div className="d-flex justify-content-center">
                    <h3>Sửa</h3>
                </div>
                <div>
                    <label>Tên</label>
                    <TextField
                        className="form-control"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                    />
                </div>
                <div className="d-flex justify-content-end mt-2">
                    <Button 
                        onClick={onClose}
                        variant="outlined"
                        color="warning"
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleUpdate}
                        variant="outlined"
                        color="primary"
                        className="ms-2"
                    >
                        Sửa
                    </Button>
                </div>
            </div>
        </Dialog>
    );
}

export default EditDialog;