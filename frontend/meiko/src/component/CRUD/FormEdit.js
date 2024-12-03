function FormEdit(obj, data) {
    return (
<Dialog open={open} onClose={handleClose}>
                <DialogTitle>Cập nhật thông tin khách hàng</DialogTitle>
                <DialogContent>
                    {selectedUser && (
                        Object.entries(selectedUser).map(([key, value]) => (
                            key !== 'id' && ( // Giả sử bạn không muốn hiển thị ID
                                <TextField
                                    key={key}
                                    margin="dense"
                                    label={key.charAt(0).toUpperCase() + key.slice(1)} // Capitalize the first letter
                                    type={key === 'email' ? 'email' : 'text'}
                                    fullWidth
                                    variant="outlined"
                                    value={value}
                                    onChange={(e) => setSelectedUser({ ...selectedUser, [key]: e.target.value })}
                                />
                            )
                        ))
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={handleUpdate} color="primary">
                        Cập nhật
                    </Button>
                </DialogActions>
            </Dialog>
    );
}

export default FormEdit;