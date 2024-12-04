import { Box, Tab, Tabs, Button, IconButton } from "@mui/material";
import { useState, useRef, createContext } from "react";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";
import NoContent from "./NoContent";
import ListProduct from "./ListProduct";
import generateSerialCode from '../../customHook/useRandom';
import apiURL from "../../routes/API";
import BillInfo from "./BillInfo";

// Tạo context trực tiếp trong file
export const BillInfoContext = createContext();

function SoldOfline() {
    const [index, setIndex] = useState(0);
    const [tabs, setTabs] = useState([]);
    const [bills, setBills] = useState([]);
    const billInfoRef = useRef();

    const handleChangeTab = (e, newValue) => {
        setIndex(newValue);
    };

    const handleReloadFromAnother = () => {
        if (billInfoRef.current) {
            billInfoRef.current.reload(); // Gọi hàm reload từ BillInfo
        }
    };

    const handleAddTab = async () => {
        if (tabs.length >= 5) {
            toast.warning("Chỉ có thể thêm tối đa 5 hóa đơn");
            return;
        }

        const RandomCode = generateSerialCode();
        const newBill = {
            billCode: RandomCode.toString(),
            isShipping: false,
            total: 0,
            status: 0,
            paymentAmount: 0,
            shippingFee: 0,
        };

        try {
            const res = await fetch(apiURL.bill.create, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newBill)
            });

            if (!res.ok) {
                throw new Error('Tạo hóa đơn thất bại');
            }

            const createdBill = await res.json();
            setBills([...bills, createdBill]); // Lưu bill vào danh sách
            setTabs([...tabs, `Hóa đơn ${newBill.billCode}`]); // Tạo tab mới
            setIndex(tabs.length);
            toast.success('Tạo hóa đơn thành công!');
        } catch (error) {
            console.error(error);
            toast.error(error.message || 'Có lỗi xảy ra!');
        }
    };

    const handleCloseTab = async (tabIndex) => {
        const billToDelete = bills[tabIndex];
        if (!billToDelete) return;
        try {
            const res = await fetch(`${apiURL.bill.delete}${billToDelete.id}`, { method: 'DELETE' });
            if (!res.ok) {
                throw new Error('Xóa hóa đơn thất bại');
            }
            const newTabs = tabs.filter((_, i) => i !== tabIndex);
            const newBills = bills.filter((_, i) => i !== tabIndex);

            setTabs(newTabs);
            setBills(newBills);

            // Điều chỉnh index nếu tab hiện tại bị đóng
            if (tabIndex === index) {
                setIndex(tabIndex > 0 ? tabIndex - 1 : 0);
            } else if (tabIndex < index) {
                setIndex(index - 1);
            }

            toast.success('Xóa hóa đơn thành công!');
        } catch (error) {
            console.error(error);
            toast.error(error.message || 'Có lỗi xảy ra!');
        }
    };

    return (
        <BillInfoContext.Provider value={{ handleReloadFromAnother }}>
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
                                <h4>Thông tin của {tabs[index]}</h4>
                                <ListProduct bill={bills[index]}/>
                                <BillInfo bill={bills[index]} ref={billInfoRef}/>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </BillInfoContext.Provider>
    );
}

export default SoldOfline;
