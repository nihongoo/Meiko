import DataTable from '../../component/Table/Table.js';
import SearchInput from '../../component/Search/index.js';
import apiURL from '../../Routes/API/index.js';
import { useState, useEffect } from 'react';
import Create from '../../component/CRUD/CreateSM.js';

function ManageCategory() {
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [create, setCreate] = useState(false);
  const [dataChange, setDataChange] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Số lượng item trên mỗi trang

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(apiURL.category.all);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const formatData = data.map((item)=>({
          id: item.idCategory,
          name: item.name,
          status: item.status,
        }))
        setCategory(formatData);
        setDataChange(false);
        localStorage.setItem('category',JSON.stringify(formatData))
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [dataChange]);

  const handleSearch = (data) => {
    setCategory(data);
  };

  const handleChangeData = () => {
    setDataChange(true);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = category.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(category.length / itemsPerPage);

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
    { Header: 'STT', accessor: 'serialNumber' }, // Thêm cột STT
    { Header: 'Name', accessor: 'name' },
    { Header: 'Status', accessor: 'status' }
  ];

  return (
    <div className='border bg-light rounded-3'>
      <div className='p-3'>
        <div className='d-flex mb-2 justify-content-between'>
          <SearchInput ApiURL={apiURL.category.search} onSearch={handleSearch} />
          <div>
            <button
              className='btn btn-outline-success'
              onClick={() => setCreate(true)}
            >
              + Thêm mới
            </button>
            {create && (
              <Create
                apiURL={apiURL.category.create}
                pageName={'loại sản phẩm'}
                onClose={() => setCreate(false)}
                onChangeData={handleChangeData}
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
          apiURLDel={apiURL.category.delete}
          apiURLEdit={apiURL.category.edit}
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

export default ManageCategory;