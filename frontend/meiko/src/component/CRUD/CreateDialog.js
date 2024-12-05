import { Dialog, TextField, Button } from "@mui/material";
import { useEffect, useState } from "react";

function CreateDialog({ open, onClose, setItem, onCreate }) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
            <div className="p-3">
                <div className="d-flex justify-content-center">
                    <h3>Thêm loại sản phẩm</h3>
                </div>
                <div>
                    <label>Tên</label>
                    <TextField
                        className="form-control"
                        type="text"
                        onChange={(e) => setItem({name: e.target.value})}
                        fullWidth
                        variant="outlined"
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
                        onClick={onCreate}
                        variant="outlined"
                        color="primary"
                        className="ms-2"
                    >
                        Thêm
                    </Button>
                </div>
            </div>
        </Dialog>
    );
}

export default CreateDialog;