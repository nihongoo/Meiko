import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Box } from "@mui/material";

function NotePrevStatus({ open, onClose, item, setItem, onSave }) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Quay lại bước trước</DialogTitle>
            <DialogContent>
                <Box className="mt-2">
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        placeholder="Ghi chú tối thiểu 30 ký tự"
                        value={item || ""}
                        onChange={(e) => setItem(e.target.value)}
                        label="Ghi chú"
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" color="error" onClick={onClose}>
                    Đóng
                </Button>
                <Button
                    variant="outlined"
                    color="success"
                    onClick={() => {onSave();setItem('');onClose()}}
                >
                    Lưu
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default NotePrevStatus;
