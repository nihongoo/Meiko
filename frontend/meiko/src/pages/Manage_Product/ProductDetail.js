import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';

function ProductDetail({ size, nameProduct, productDetails, color, onDelete, onUpdate }) {
    const rows = productDetails.map(product => ({
        ...product,
        size: size.find(c => c.id === product.sizeId).name || 'N/A',
    }));

    if (!rows || rows.length === 0) {
        return null;
    }
    console.log(color);


    const columns = [
        { field: 'name', headerName: 'Sản phẩm', flex: 1, valueGetter: () => nameProduct },
        { field: 'size', headerName: 'Kích cỡ', flex: 1 },
        {
            field: 'quantity',
            headerName: 'Số lượng',
            type: 'number',
            flex: 1,
            editable: true,
        },
        {
            field: 'importPrice',
            headerName: 'Giá nhập',
            type: 'number',
            flex: 1,
            editable: true,
        },
        {
            field: 'price',
            headerName: 'Giá bán',
            type: 'number',
            flex: 1,
            editable: true,
        },
        {
            field: 'delete',
            headerName: 'Xóa',
            flex: 1,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => onDelete(params.row.id)}
                >
                    Xóa
                </Button>
            ),
        },
    ];

    const handleRowEdit = (updateRow) => {
        onUpdate(updateRow)
        return updateRow
    }
    const paginationModel = { page: 0, pageSize: 5 };

    return (
        <div className="border mt-4 bg-light rounded-3">
            <div className='d-flex align-items-center ms-4 mt-2'>
                <p className='m-2'>Danh sách sản phẩm màu:</p>
                <p
                    className='p-0 m-0'
                    style={{
                        color: color.hex,
                    }}
                >{color.name}</p>
            </div>
            <div className='m-4 mt-0'>
                <DataGrid
                    columns={columns}
                    rows={rows}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10]}
                    processRowUpdate={handleRowEdit}
                    onProcessRowUpdateError={(error) => { console.log(error) }}
                    disableRowSelectionOnClick
                    rowHeight={80}
                    sx={{
                        border: 'none',
                        '& .MuiDataGrid-cell': {
                            borderBottom: 'none',
                        },
                        '& .MuiDataGrid-columnHeaders': {
                            borderBottom: 'none',
                        },
                        backgroundColor: '#fff',
                        minHeight: 350, 
                        maxHeight: 'calc(100vh - 200px)',
                    }}
                />
            </div>
        </div>
    );
}

export default ProductDetail;