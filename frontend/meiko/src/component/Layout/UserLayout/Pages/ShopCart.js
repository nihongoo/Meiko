import Header from '../Header/index.js';
import Footer from '../Footer/index.js';
import ProductCart from '../Features/Cart/ProductCart.js';
function ShopCart(){
    return (
        <div>
            <Header />
            <div style={{paddingTop: "160px"}}>
                <ProductCart/>
            </div>
            <Footer />
        </div>
    );
}

export default ShopCart;