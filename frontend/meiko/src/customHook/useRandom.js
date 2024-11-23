function generateSerialCode() {
    let serialCode = '';
    for (let i = 0; i < 6; i++) {
        serialCode += Math.floor(Math.random() * 10); // Tạo số ngẫu nhiên từ 0-9
    }
    return parseInt(serialCode, 10); // Trả về dưới dạng số nguyên (int)
}

export default generateSerialCode