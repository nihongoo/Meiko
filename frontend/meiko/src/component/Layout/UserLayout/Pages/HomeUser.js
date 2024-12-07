import 'font-awesome/css/font-awesome.min.css'
import Header from '../Header/index'
import Hero from "../Features/Banner/index";
import FeaturedProducts from '../Features/Product/FeaturedProducts';
import BestSellingProducts from '../Features/Product/BestSellingProducts';
import Footer from '../Footer/index';

function HomeUser() {
    return (
        <div >
            <Header/>
            <div style={{marginTop: "160px"}}>
                <Hero />
                <div style={{ marginTop: '80px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '1310px', width: '100%' }}>
                        <div style={{ width: '23%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingLeft: '10px' }}>
                            <i className="fa fa-truck" style={{ fontSize: '2rem', marginBottom: '10px', color: '#e74c3c' }}></i>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Miễn Phí Vận Chuyển</h3>
                            <p>Miễn phí vận chuyển cho tất cả đơn hàng</p>
                        </div>
                        <div style={{ width: '23%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingLeft: '10px' }}>
                            <i className="fa fa-headphones" style={{ fontSize: '2rem', marginBottom: '10px', color: '#2ecc71' }}></i>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Hỗ Trợ 24/7</h3>
                            <p>Hỗ trợ khách hàng suốt 24 giờ mỗi ngày</p>
                        </div>
                        <div style={{ width: '23%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingLeft: '10px' }}>
                            <i className="fa fa-refresh" style={{ fontSize: '2rem', marginBottom: '10px', color: '#f39c12' }}></i>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Hoàn Tiền</h3>
                            <p>30 ngày trả lại hàng miễn phí</p>
                        </div>
                        <div style={{ width: '23%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingLeft: '10px' }}>
                            <i className="fa fa-lock" style={{ fontSize: '2rem', marginBottom: '10px', color: '#3498db' }}></i>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Thanh Toán 100%</h3>
                            <p>Chúng tôi đảm bảo thanh toán an toàn</p>
                        </div>
                    </div>
                </div>
                <FeaturedProducts/>
            </div>
            <Footer />
        </div>
    );
}

export default HomeUser;
