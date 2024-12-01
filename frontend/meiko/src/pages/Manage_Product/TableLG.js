import PropTypes from 'prop-types';
import moment from 'moment';
import { Link } from 'react-router-dom';
import apiURL from '../../Routes/API/index.js';
import Delete from '../../component/CRUD/Delete'

function TableLG({ columns, data }) {
    return (
        <div>
            <table className="table">
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th key={column.accessor} scope="col">{column.Header}</th>
                        ))}
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => {
                        return (
                            <tr key={item.id}>
                                {columns.map((column) => (
                                    <td key={column.accessor}>
                                        {column.accessor === 'createTime'
                                            ? moment(item[column.accessor]).format('DD-MM-YYYY')
                                            : column.accessor === 'image'
                                                ? <img src={item[column.accessor]} alt="Product" style={{ width: '50px', height: '50px' }} />
                                                : item[column.accessor]
                                        }
                                    </td>
                                ))}
                                <td>
                                    <div className='d-flex'>
                                        <Link 
                                        to={`/listproductdetail/${item.id}`}
                                        className='btn btn-outline-warning me-1'
                                        >Detail</Link>
                                        <Delete apiURL={apiURL.product.delete} id={item.id} onChangeData={() => { }} />
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

TableLG.propTypes = {
    columns: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
};


export default TableLG;