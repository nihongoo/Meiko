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
  const [selectedFilters, setSelectedFilters] = useState({});
  const [openIndices, setOpenIndices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch filter data when the component mounts
  useEffect(() => {
    const fetchFilters = async () => {
      setLoading(true);
      try {
        console.log('Fetching filters...');
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
      const selectedOptions = new Set(newFilters[filter] || []);

      if (selectedOptions.has(option)) {
        selectedOptions.delete(option); // If already selected, unselect it
      } else {
        selectedOptions.add(option); // If not selected, add it
      }

      newFilters[filter] = Array.from(selectedOptions); // Update filter
      return newFilters;
    });
  };

  // Use useEffect to notify parent component when selectedFilters changes
  useEffect(() => {
    onFilterChange(selectedFilters);
  }, [selectedFilters, onFilterChange]);

  // Clear all selected filters
  const clearAllFilters = () => {
    setSelectedFilters({});
  };

  // Check if a filter option is selected
  const isFilterSelected = (filter, option) => {
    return selectedFilters[filter]?.includes(option.name || option) || false;
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className={`${styles.sidebar} p-4 rounded`}>
          {loading ? (
            <p>Loading filters...</p>
          ) : (
            <>
              {/* Show selected filters */}
              {Object.keys(selectedFilters).length > 0 && (
                <div className="d-flex flex-wrap mb-3">
                  <button
                    onClick={clearAllFilters}
                    className={`btn btn-sm btn-link text-danger me-3 ${styles.clearAllBtn}`}
                  >
                    Clear All
                  </button>
                  {Object.entries(selectedFilters).map(([filter, options], idx) => (
                    <div key={idx} className="d-flex align-items-center me-3 mb-2">
                      {options.map((option, i) => (
                        <div key={i} className="badge bg-secondary d-flex align-items-center">
                          <span>{option}</span>
                          <button
                            className="btn-close btn-sm ms-2"
                            onClick={() => handleFilterChange(filter, option)}
                          ></button>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {/* Render filter categories */}
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
                    <span className="fw-bold">{filterKey.charAt(0).toUpperCase() + filterKey.slice(1)}</span>
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
                            checked={isFilterSelected(filterKey, option.name || option)}
                            onChange={() => handleFilterChange(filterKey, option.name || option)}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`filter-${filterKey}-${optIndex}`}
                          >
                            {option.name || option}
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
