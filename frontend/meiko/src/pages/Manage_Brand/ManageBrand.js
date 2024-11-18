import DataTable from '../../component/Table/Table.js';
import SearchInput from '../../component/Search/index.js';
import apiURL from '../../Routes/API/index.js';
import { useState, useEffect } from 'react';
import Create from '../../component/CRUD/CreateSM.js';

function ManageBrand() {
    const [brand, setbrand] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [create, setCreate] = useState(false);
    const [dataChange, setDataChange] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
  
    useEffect(() => {
      const fetchCategories = async () => {
        try {
          const response = await fetch(apiURL.brand.all);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();

          const formatData = data.map((item, index)=>({
            id: item.idBrand,
            brandCode: item.brandCode,
            name: item.name,
            status: item.status,
          }))
          setbrand(formatData);
          setDataChange(false);
          localStorage.setItem('brand',JSON.stringify(formatData))
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchCategories();
    }, [dataChange]);
  
    const handleSearch = (data) => {
      setbrand(data);
    };
  
    const handleChangeData = () => {
      setDataChange(true);
    };
  
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = brand.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(brand.length / itemsPerPage);
  
    const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
    };
  
    const handleItemsPerPageChange = (event) => {
      setItemsPerPage(Number(event.target.value));
      setCurrentPage(1);
    };
  
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
  
    const columns = [
      { Header: 'STT', accessor: 'serialNumber' }, 
      { Header: 'BrandCode', accessor: 'brandCode' }, 
      { Header: 'Name', accessor: 'name' },
      { Header: 'Status', accessor: 'status' }
    ];
    const brandCode = {
        brandCode: ''
    }
  
    return (
      <div className='border bg-light rounded-3'>
        <div className='p-3'>
          <div className='d-flex mb-2 justify-content-between'>
            <SearchInput ApiURL={apiURL.brand.search} onSearch={handleSearch} />
            <div>
              <button
                className='btn btn-outline-success'
                onClick={() => setCreate(true)}
              >
                + Thêm mới
              </button>
              {create && (
                <Create
                  apiURL={apiURL.brand.create}
                  pageName={'thương hiệu'}
                  onClose={() => setCreate(false)}
                  onChangeData={handleChangeData}
                  moreField={brandCode}
                />
              )}
            </div>
          </div>
          <DataTable 
            columns={columns} 
            data={currentItems.map((item, index) => ({
              ...item,
              serialNumber: index + 1 + (currentPage - 1) * itemsPerPage
            }))}
            onChangeData={handleChangeData}
            apiURLDel={apiURL.brand.delete}
            apiURLEdit={apiURL.brand.edit}
          />
          <div className="d-flex justify-content-between mt-3">
            <div>
              <label>Số lượng mục trên trang:</label>
              <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
              </select>
            </div>
            <div>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`btn ${currentPage === index + 1 ? 'btn-primary' : 'btn-secondary'} mx-1`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
}

export default ManageBrand;