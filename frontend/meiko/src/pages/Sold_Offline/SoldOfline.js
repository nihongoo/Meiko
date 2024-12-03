import { Box, Tab, Tabs, Button, IconButton } from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";
import NoContent from "./NoContent";
import ListProduct from "./ListProduct";

function SoldOfline() {
    const [index, setIndex] = useState(0);
    const [tabs, setTabs] = useState([]);

    const handleChangeTab = (e, newValue) => {
        setIndex(newValue);
    };

    const handleAddTab = () => {
        if (tabs.length >= 5) {
            toast.warning("Chỉ có thể thêm tối đa 5 hóa đơn");
            return;
        }
        const newTabName = `Đơn hàng ${tabs.length + 1}`;
        setTabs([...tabs, newTabName]);
        setIndex(tabs.length);
    };

    const handleCloseTab = (tabIndex) => {
        const newTabs = tabs.filter((_, i) => i !== tabIndex);
        setTabs(newTabs);

        // Điều chỉnh index nếu tab hiện tại bị đóng
        if (tabIndex === index) {
            setIndex(tabIndex > 0 ? tabIndex - 1 : 0);
        } else if (tabIndex < index) {
            setIndex(index - 1);
        }
    };

    return (
        <div>
            <div className="border bg-light rounded-3">
                <div className="d-flex justify-content-center m-2">
                    <h2>Bán hàng</h2>
                </div>
                <div className="p-3">
                    <Box sx={{ width: "100%" }}>
                        <div className="d-flex justify-content-end">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleAddTab}
                            >
                                Thêm hóa đơn
                            </Button>
                        </div>
                        <Tabs
                            value={index}
                            onChange={handleChangeTab}
                            variant="scrollable"
                            scrollButtons="auto"
                        >
                            {tabs.map((tab, i) => (
                                <Tab
                                    key={i}
                                    label={
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                            }}
                                        >
                                            {tab}
                                            <IconButton
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCloseTab(i);
                                                }}
                                            >
                                                <CloseIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    }
                                />
                            ))}
                        </Tabs>
                    </Box>
                    {tabs.length === 0 ? (
                        <NoContent />
                    ) : (
                        <div className="mt-2">
                            <h4>Nội dung của {tabs[index]}</h4>
                            <ListProduct/>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SoldOfline;
