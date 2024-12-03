import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button, 
  IconButton 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import apiURL from '../../routes/API/index.js';
import Delete from '../../component/CRUD/Delete';

function TableLG({ columns, data }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        {/* Header */}
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.accessor} align="left">
                {column.Header}
              </TableCell>
            ))}
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>

        {/* Body */}
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              {columns.map((column) => (
                <TableCell key={column.accessor} align="left">
                  {column.accessor === 'createTime'
                    ? moment(item[column.accessor]).format('DD-MM-YYYY')
                    : column.accessor === 'image' ? (
                      <img
                        src={item[column.accessor]}
                        alt="Product"
                        style={{ width: '50px', height: '50px', borderRadius: '4px' }}
                      />
                    ) : (
                      item[column.accessor]
                    )}
                </TableCell>
              ))}

              {/* Actions */}
              <TableCell align="center">
                <Button
                  variant="outlined"
                  color="warning"
                  size="small"
                  component={Link}
                  to={`/listproductdetail/${item.id}`}
                  sx={{ marginRight: 1 }}
                >
                  Detail
                </Button>
                <IconButton
                  color="error"
                  onClick={() => {
                    Delete({
                      apiURL: apiURL.product.delete,
                      id: item.id,
                      onChangeData: () => {},
                    });
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

TableLG.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
};

export default TableLG;
