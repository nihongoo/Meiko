import React, { useState } from "react";
import Header from "../Header/index";
import Footer from "../Footer/index";
import Navbar from "../Features/Navbar/index";
import Filter from "../Features/Navbar/Filter";
import ListProducts from "../Features/Product/ListProduct";

function Shop() {
  const [selectedFilters, setSelectedFilters] = useState([]);

  // Hàm xử lý thay đổi bộ lọc
  const handleFilterChange = (filters) => {
    setSelectedFilters(filters); // Cập nhật state với các bộ lọc mới
  };

  return (
    <div>
      <Header />
      <Navbar />
      <div className="container mt-4">
        <div className="row">
          <div className="col-lg-3 col-md-4 col-12 mb-4">
            <Filter onFilterChange={handleFilterChange} />
          </div>
          <div className="col-lg-9 col-md-8 col-12">
            <ListProducts selectedFilters={selectedFilters} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Shop;
