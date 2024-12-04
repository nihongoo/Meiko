import React, { useState } from "react";
import Header from "../Header";
import Footer from "../Footer";
import Order from "../Features/Cart/Order";
import Recipient from "../Features/Cart/Recipient";
import { ToastContainer } from 'react-toastify';
import { useLocation } from 'react-router-dom';

function Checkout () {
    const location = useLocation();
    const { paymentData } = location.state || {};
    const [shippingFee, setShippingFee] = useState(0);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [loading, setLoading] = useState(false);

    if (!paymentData) {
        return <p>Không có dữ liệu thanh toán.</p>;
    }

    const { selectedItems, total, discount, coupon, productDetailsInfo } = paymentData;

    const handleSelectAddress = (address) => {
        setSelectedAddress(address);
    };

    return (
        <div>
            <Header />
            <div style={{paddingTop: "190px", paddingLeft: "100px"}}>
                <ToastContainer />
                <div className={`row container`}>
                    <div className={`col-md-8`}>
                        <Recipient 
                            setShippingFee={setShippingFee}
                            onSelectAddress={handleSelectAddress}
                        />
                    </div>
                    <div className={`col-md-4`}>
                        <Order
                            selectedItems={selectedItems}
                            total={total}
                            discount={discount}
                            coupon={coupon}
                            productDetailsInfo={productDetailsInfo}
                            shippingFee={shippingFee} 
                            selectedAddress={selectedAddress}
                            setLoading={setLoading}
                        />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Checkout;
