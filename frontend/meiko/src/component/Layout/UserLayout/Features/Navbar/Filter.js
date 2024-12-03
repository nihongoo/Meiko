import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../Navbar/Filter.module.css";
import { useState, useEffect } from "react";

const apiURL = {
  category: { GetAll: "https://localhost:7172/api/Category/get-all" },
  brand: { GetAll: "https://localhost:7172/api/Brand/get-all" },
  color: { GetAll: "https://localhost:7172/api/Color/get-all" },
  material: { GetAll: "https://localhost:7172/api/Material/get-all" },
  size: { GetAll: "https://localhost:7172/api/Size/get-all" },
};

const FilterSidebar = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    categories: [],
    brands: [],
    colors: [],
    materials: [],
    sizes: [],
  });
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [],
    brands: [],
    colors: [],
    materials: [],
    sizes: [],
    priceRange: "",
  });
  const [openIndices, setOpenIndices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch filter data when the component mounts
  useEffect(() => {
    const fetchFilters = async () => {
      setLoading(true);
      try {
        const [categoriesRes, brandsRes, colorsRes, materialsRes, sizesRes] = await Promise.allSettled([
          fetch(apiURL.category.GetAll),
          fetch(apiURL.brand.GetAll),
          fetch(apiURL.color.GetAll),
          fetch(apiURL.material.GetAll),
          fetch(apiURL.size.GetAll),
        ]);

        const categories = categoriesRes.status === "fulfilled" ? await categoriesRes.value.json() : [];
        const brands = brandsRes.status === "fulfilled" ? await brandsRes.value.json() : [];
        const colors = colorsRes.status === "fulfilled" ? await colorsRes.value.json() : [];
        const materials = materialsRes.status === "fulfilled" ? await materialsRes.value.json() : [];
        const sizes = sizesRes.status === "fulfilled" ? await sizesRes.value.json() : [];

        setFilters({
          categories: categories.data || categories,
          brands: brands.data || brands,
          colors: colors.data || colors,
          materials: materials.data || materials,
          sizes: sizes.data || sizes,
        });
      } catch (error) {
        console.error("Error fetching filters:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilters();
  }, []);

  // Toggle the dropdown for filter sections
  const toggleDropdown = (index) => {
    setOpenIndices((prevState) =>
      prevState.includes(index)
        ? prevState.filter((i) => i !== index)
        : [...prevState, index]
    );
  };

  // Handle changing selected filter options
  const handleFilterChange = (filter, option) => {
    setSelectedFilters((prevSelectedFilters) => {
      const newFilters = { ...prevSelectedFilters };
      const selectedOptions = newFilters[filter] || [];

      if (selectedOptions.includes(option.id)) {
        newFilters[filter] = selectedOptions.filter(id => id !== option.id);
      } else {
        newFilters[filter] = [...selectedOptions, option.id];
      }

      return newFilters;
    });
  };

  // Handle price range selection (ensure only one price range is selected)
  const handlePriceRangeChange = (priceRange) => {
    setSelectedFilters((prevSelectedFilters) => ({
      ...prevSelectedFilters,
      priceRange: prevSelectedFilters.priceRange === priceRange ? "" : priceRange, // Toggle the price range
    }));
  };

  // Use useEffect to notify parent component when selectedFilters changes
  useEffect(() => {
    onFilterChange(selectedFilters);
  }, [selectedFilters, onFilterChange]);

  // Clear all selected filters
  const clearAllFilters = () => {
    setSelectedFilters({
      categories: [],
      brands: [],
      colors: [],
      materials: [],
      sizes: [],
      priceRange: "",
    });
  };

  // Check if a filter option is selected
  const isFilterSelected = (filter, option) => {
    return selectedFilters[filter]?.includes(option.id) || false;
  };

  // Render price range badge text
  const getPriceRangeLabel = (priceRange) => {
    switch (priceRange) {
      case "under-20k":
        return "Dưới 20k";
      case "20k-100k":
        return "Từ 20k - 100k";
      case "100k-200k":
        return "Từ 100k - 200k";
      case "200k-500k":
        return "Từ 200k - 500k";
      case "500k-above":
        return "Trên 500k";
      default:
        return "";
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className={`${styles.sidebar} p-4 rounded`}>
          {loading ? (
            <p>Đang tải bộ lọc...</p>
          ) : (
            <>
              {/* Clear Filters Button */}
              {Object.keys(selectedFilters).length > 0 && (
                <div className="d-flex flex-wrap mb-3">
                  <button
                    onClick={clearAllFilters}
                    className={`btn btn-sm btn-link text-danger me-3 ${styles.clearAllBtn}`}
                  >
                    Xóa tất cả
                  </button>
                  {/* Display selected price range */}
                  {selectedFilters.priceRange && (
                    <div className="badge bg-secondary me-2">
                      {getPriceRangeLabel(selectedFilters.priceRange)}
                      <button
                        className="btn-close btn-sm ms-2"
                        onClick={() => handlePriceRangeChange("")}
                      ></button>
                    </div>
                  )}
                </div>
              )}

              {/* Price Range Filter (Dropdown with Radio Buttons) */}
              <div className="mb-4">
                <div
                  className="d-flex justify-content-between align-items-center p-2"
                  onClick={() => toggleDropdown("priceRange")}
                  style={{
                    cursor: "pointer",
                    backgroundColor: "#ffffff",
                  }}
                >
                  <span className="fw-bold">Khoảng giá</span>
                  <i
                    className={`fa ${openIndices.includes("priceRange") ? "fa-chevron-up" : "fa-chevron-down"}`}
                    style={{ fontSize: "1.2rem" }}
                  ></i>
                </div>
                <div
                  className={`${styles.dropdownBody} ${openIndices.includes("priceRange") ? styles.open : ""} mt-2`}
                >
                  <ul className="list-unstyled mt-2">
                    {["under-20k", "20k-100k", "100k-200k", "200k-500k", "500k-above"].map((priceRange) => (
                      <li key={priceRange} className="form-check mb-2">
                        <input
                          type="radio"
                          className="form-check-input"
                          id={priceRange}
                          name="priceRange"
                          checked={selectedFilters.priceRange === priceRange}
                          onChange={() => handlePriceRangeChange(priceRange)}
                        />
                        <label className="form-check-label" htmlFor={priceRange}>
                          {getPriceRangeLabel(priceRange)}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
                <hr className="mt-2" />
              </div>

              {/* Render Filter Categories */}
              {Object.entries(filters).map(([filterKey, options], index) => (
                <div key={index} className="mb-4">
                  <div
                    className="d-flex justify-content-between align-items-center p-2"
                    onClick={() => toggleDropdown(index)}
                    style={{
                      cursor: "pointer",
                      backgroundColor: "#ffffff",
                    }}
                  >
                    <span className="fw-bold">
                      {filterKey === "categories"
                        ? "Danh mục"
                        : filterKey === "brands"
                        ? "Thương hiệu"
                        : filterKey === "colors"
                        ? "Màu sắc"
                        : filterKey === "materials"
                        ? "Chất liệu"
                        : "Kích cỡ"}
                    </span>
                    <i
                      className={`fa ${openIndices.includes(index) ? "fa-chevron-up" : "fa-chevron-down"}`}
                      style={{ fontSize: "1.2rem" }}
                    ></i>
                  </div>

                  <div
                    className={`${styles.dropdownBody} ${openIndices.includes(index) ? styles.open : ""} mt-2`}
                  >
                    <ul className="list-unstyled mt-2">
                      {options.map((option, optIndex) => (
                        <li key={optIndex} className="form-check mb-2 d-flex align-items-center gap-2">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id={`filter-${filterKey}-${optIndex}`}
                            checked={isFilterSelected(filterKey, option)}
                            onChange={() => handleFilterChange(filterKey, option)}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`filter-${filterKey}-${optIndex}`}
                          >
                            {option.name}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <hr className="mt-2" />
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
