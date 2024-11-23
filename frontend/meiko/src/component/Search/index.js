import { useState } from "react";
import { toast } from "react-toastify";

function SearchInput({ApiURL, onSearch, optional}) {
    const [query,setQuery] = useState('')
    const handleSearch = async () => {
        if (!query){
            toast.warning('Vui lòng nhập từ khóa vào ô tìm kiếm để hiển thị kết quả hoặc tải lại trang để hiển thị toàn bộ!')
            return;
        } 
    
        try {         
            const response = await fetch(`${ApiURL}?query=${encodeURIComponent(query)}&${optional}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }         
            const data = await response.json();           
            onSearch(data);
            
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

    return (
        <div className="d-flex">
            <input 
            style={{ width: '100%', maxWidth: 600 }} 
            className="form-control" 
            placeholder="Nhập từ khóa để tìm kiếm ..."
            value={query}
            onChange={(e)=>setQuery(e.target.value)}
            />
            <button className="btn" onClick={handleSearch}>
                <i className="fa-solid fa-magnifying-glass"></i>
            </button>
        </div>
    );
}

export default SearchInput;