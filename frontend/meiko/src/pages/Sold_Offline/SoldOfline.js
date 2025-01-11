import { Box, Tab, Tabs, Button, IconButton, Typography, Paper } from "@mui/material";
import { useState, useRef, createContext, useEffect } from "react";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";
import NoContent from "./NoContent";
import ListProduct from "./ListProduct";
import generateSerialCode from '../../customHook/useRandom';
import apiURL from "../../routes/API";
import BillInfo from "./BillInfo";

export const BillInfoContext = createContext();

function SoldOfline() {
    const [index, setIndex] = useState(0);
    const [tabs, setTabs] = useState([]);
    const [bills, setBills] = useState([]);
    const billInfoRef = useRef();
    const staffInfo = JSON.parse(localStorage.getItem('staffInfo'));
    useEffect(() => {
        const storedBills = localStorage.getItem('bills');
        const storedTabs = localStorage.getItem('tabs');
        if (storedBills) {
            setBills(JSON.parse(storedBills));
        }
        if (storedTabs) {
            setTabs(JSON.parse(storedTabs));
        }
    }, []);

    useEffect(() => {
        if (bills.length > 0) {
            localStorage.setItem('bills', JSON.stringify(bills));
        }
        if (tabs.length > 0) {
            localStorage.setItem('tabs', JSON.stringify(tabs));
        }
    }, [bills, tabs]);

    const handleChangeTab = (e, newValue) => {
        setIndex(newValue);
    };

    const handleReloadFromAnother = () => {
        if (billInfoRef.current) {
            billInfoRef.current.reload();
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
            staffId: staffInfo.id,
            billType:'POS'
        };
        const payload = {
            statusType: 0,
            note: 'Tạo mới hóa đơn thành công',
            staffWhoCreatedThis: staffInfo.id,
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
            setBills((prevBills) => {
                const newBills = [...prevBills, createdBill];
                localStorage.setItem('bills', JSON.stringify(newBills));
                return newBills;
            });

            setTabs((prevTabs) => {
                const newTabs = [...prevTabs, `Hóa đơn ${newBill.billCode}`];
                localStorage.setItem('tabs', JSON.stringify(newTabs));
                return newTabs;
            });
            await fetch(`${apiURL.bill.changeStatus}${createdBill.id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
            setIndex(tabs.length);
            toast.success('Tạo hóa đơn thành công!');
        } catch (error) {
            console.error(error);
            toast.error(error.message || 'Có lỗi xảy ra!');
        }
    };

    const handleCloseTab = async (tabIndex, customMessage = 'Đóng hóa đơn thành công!') => {
        const billToDelete = bills[tabIndex];
        if (!billToDelete) return;

        try {
            // const res = await fetch(`${apiURL.bill.delete}${billToDelete.id}`, { method: 'DELETE' });
            // if (!res.ok) {
            //     throw new Error('Xóa hóa đơn thất bại');
            // }

            setTabs((prevTabs) => {
                const newTabs = prevTabs.filter((_, i) => i !== tabIndex);
                localStorage.setItem('tabs', JSON.stringify(newTabs));
                return newTabs;
            });

            setBills((prevBills) => {
                const newBills = prevBills.filter((_, i) => i !== tabIndex);
                localStorage.setItem('bills', JSON.stringify(newBills));
                return newBills;
            });

            // Điều chỉnh index nếu tab hiện tại bị đóng
            if (tabIndex === index) {
                setIndex(tabIndex > 0 ? tabIndex - 1 : 0);
            } else if (tabIndex < index) {
                setIndex(index - 1);
            }

            toast.success(customMessage);
        } catch (error) {
            console.error(error);
            toast.error(error.message || 'Có lỗi xảy ra!');
        }
    };

    return (
        <BillInfoContext.Provider value={{ handleReloadFromAnother, handleCloseTab, index }}>
            <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
                <Box textAlign="center" mb={2}>
                    <Typography variant="h4">Bán hàng</Typography>
                </Box>

                <Box textAlign="right" mb={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddTab}
                    >
                        Thêm hóa đơn
                    </Button>
                </Box>

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
                                <Box display="flex" alignItems="center" gap={1}>
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

                <Box
                    mt={2}
                    sx={{
                        minHeight: 500,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        border: "1px dashed #ccc",
                        borderRadius: 2,
                    }}
                >
                    {tabs.length === 0 ? (
                        <NoContent />
                    ) : (
                        <Box width="100%" p={2}>
                            <Typography variant="h6" gutterBottom>
                                Thông tin của {tabs[index]}
                            </Typography>
                            <ListProduct bill={bills[index]} />
                            <BillInfo bill={bills[index]} ref={billInfoRef} />
                        </Box>
                    )}
                </Box>
            </Paper>
        </BillInfoContext.Provider>
    );
}

export default SoldOfline;
