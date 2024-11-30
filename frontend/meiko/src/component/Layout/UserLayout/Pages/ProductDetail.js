import Header from '../Header/index.js';
import Footer from '../Footer/index.js';
import Productdetail from '../Features/Product/ProductDetail.js';
function ProductDetail(){
    return (
        <div>
            <Header />
            <div style={{paddingTop: "160px"}}>
                <Productdetail/>
            </div>
            <Footer />
        </div>
    );
}

export default ProductDetail;