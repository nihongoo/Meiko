import Delete from '../CRUD/Delete';
import Edit from '../CRUD/Edit';
import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const DataTable = ({ columns, data, onChangeData, apiURLDel, apiURLEdit }) => {
    const [editId, setEditId] = useState(null);

    const handleEdit = useCallback((id) => {
        setEditId((prevId) => (prevId === id ? null : id));
    }, []);

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
                                        <button
                                            className='btn me-1 btn-outline-warning'
                                            onClick={() => handleEdit(item.id)}
                                        >
                                            Edit
                                        </button>
                                        {editId === item.id && (
                                            <Edit
                                                apiURL={apiURLEdit}
                                                onClose={() => setEditId(null)}
                                                obj={item}
                                                onChangeData={onChangeData}
                                            />
                                        )}
                                        <Delete
                                            apiURL={apiURLDel}
                                            id={item.id}
                                            onChangeData={onChangeData}
                                        />
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

DataTable.propTypes = {
    columns: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
};

export default DataTable;