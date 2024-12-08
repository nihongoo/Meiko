const Promotion = () => {
    return (
        <div style={{ marginTop: '100px', backgroundColor: '#f0f0f0', padding: '60px 0' }}>
            <h2 style={{ textAlign: 'center', fontSize: '2.5rem', fontWeight: 'bold', color: '#333', marginBottom: '40px' }}>
                Khuyến Mãi Đặc Biệt
            </h2>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' }}>

                <div style={{ 
                    width: '30%', 
                    textAlign: 'center', 
                    padding: '30px', 
                    backgroundImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.1)), url("path_to_your_image_1.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '8px', 
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease' 
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <h4 style={{ fontSize: '1.7rem', color: '#fff', fontWeight: 'bold' }}>Giảm 20% cho đơn hàng đầu tiên</h4>
                    <p style={{ color: '#fff', fontSize: '1rem' }}>Đừng bỏ lỡ cơ hội nhận ưu đãi hấp dẫn này!</p>
                    <button style={{
                        marginTop: '20px', 
                        padding: '10px 20px', 
                        backgroundColor: '#e74c3c', 
                        color: '#fff', 
                        border: 'none', 
                        borderRadius: '5px', 
                        cursor: 'pointer',
                        fontSize: '1rem',
                        transition: 'background-color 0.3s ease, transform 0.3s ease'
                    }} 
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c0392b'} 
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e74c3c'}
                    >
                        Xem Chi Tiết
                    </button>
                </div>

                <div style={{ 
                    width: '30%', 
                    textAlign: 'center', 
                    padding: '30px', 
                    backgroundImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.1)), url("path_to_your_image_2.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '8px', 
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease' 
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <h4 style={{ fontSize: '1.7rem', color: '#fff', fontWeight: 'bold' }}>Mua 1 Tặng 1</h4>
                    <p style={{ color: '#fff', fontSize: '1rem' }}>Các sản phẩm nổi bật sẽ được giảm giá đặc biệt.</p>
                    <button style={{
                        marginTop: '20px', 
                        padding: '10px 20px', 
                        backgroundColor: '#f39c12', 
                        color: '#fff', 
                        border: 'none', 
                        borderRadius: '5px', 
                        cursor: 'pointer',
                        fontSize: '1rem',
                        transition: 'background-color 0.3s ease, transform 0.3s ease'
                    }} 
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e67e22'} 
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f39c12'}
                    >
                        Xem Chi Tiết
                    </button>
                </div>

            </div>
        </div>
    );
}

export default Promotion;
