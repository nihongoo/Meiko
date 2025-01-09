import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, TextareaAutosize, Button, Dialog, DialogTitle, DialogContent, DialogActions, Box, Input } from '@mui/material';
import { toast } from 'react-toastify';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Paper,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Color from './Color'
import Size from './Size';

export const ProductNameField = ({ products, value, onChange, error }) => (
  <Autocomplete
    disablePortal
    options={products}
    value={value}
    onInputChange={(event, newValue) => onChange('name', newValue)}
    getOptionLabel={(option) => option.name || ''}
    renderInput={(params) => (
      <TextField
        {...params}
        label="Nhập tên sản phẩm"
        variant="outlined"
        fullWidth
        required
        error={error && !value}
        helperText={error && !value ? 'Tên sản phẩm là bắt buộc' : ''}
      />
    )}
    freeSolo
  />
);

export const CategoryField = ({ categories, onChange, error }) => (
  <Autocomplete
    disablePortal
    options={categories}
    onChange={(event, newValue) => onChange('categoryId', newValue?.id || '')}
    getOptionLabel={(option) => option.name || ''}
    renderInput={(params) => (
      <TextField
        {...params}
        label="Nhập loại sản phẩm"
        variant="outlined"
        fullWidth
        required
        error={error?.category}
        helperText={error?.category ? 'Loại sản phẩm là bắt buộc' : ''}
      />
    )}
  />
);

export const BrandField = ({ brands, onChange, error }) => (
  <Autocomplete
    disablePortal
    options={brands}
    onChange={(event, newValue) => onChange('brandId', newValue?.id || '')}
    getOptionLabel={(option) => option.name || ''}
    renderInput={(params) => (
      <TextField
        {...params}
        label="Nhập thương hiệu"
        variant="outlined"
        fullWidth
        required
        error={error?.brand}
        helperText={error?.brand ? 'Thương hiệu là bắt buộc' : ''}
      />
    )}
  />
);

export const TargetField = ({ targets, onChange, error }) => (
  <Autocomplete
    disablePortal
    options={targets}
    onChange={(event, newValue) => onChange('targetCustomerId', newValue?.id || '')}
    getOptionLabel={(option) => option.name || ''}
    renderInput={(params) => (
      <TextField
        {...params}
        label="Nhập đối tượng sử dụng"
        variant="outlined"
        fullWidth
        required
        error={error?.target}
        helperText={error?.target ? 'Đối tượng sử dụng là bắt buộc' : ''}
      />
    )}
  />
);

export const MaterialField = ({ materials, onChange, error }) => (
  <Autocomplete
    disablePortal
    options={materials}
    onChange={(event, newValue) => onChange('materialId', newValue?.id || '')}
    getOptionLabel={(option) => option.name || ''}
    renderInput={(params) => (
      <TextField
        {...params}
        label="Nhập chất liệu"
        variant="outlined"
        fullWidth
        required
        error={error?.material}
        helperText={error?.material ? 'Chất liệu là bắt buộc' : ''}
      />
    )}
  />
);

export const DescriptionField = ({ value, onChange }) => (
  <Box mt={4}>
    <TextareaAutosize
      minRows={4}
      value={value}
      placeholder="Nhập mô tả sản phẩm"
      style={{ width: '100%', padding: '10px', borderRadius: '4px', borderColor: '#ccc' }}
      onChange={(e) => onChange('description', e.target.value)}
    />
  </Box>
);

export const ImageUpload = ({ imageUrl, onUpload, previewImage }) => {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setImage(file);
    }
  };

  const handleSelectImage = () => {
    if (!image) {
      toast.warning('Vui lòng chọn ảnh');
      return;
    }
    onUpload({ img: image, preview });
    setOpen(false);
  };

  return (
    <>
      <Button variant="outlined" color="success" onClick={() => setOpen(true)} sx={{ display: 'block', marginBottom: 2 }}>
        Thêm ảnh
      </Button>

      {imageUrl && previewImage && <img src={previewImage.preview} alt="Preview" width="190px" />}

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          <Box display="flex" justifyContent="center">
            <h2>Thêm ảnh</h2>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box padding={2}>
            <Input type="file" className="form-control" onChange={handleImageChange} fullWidth />
            {preview && (
              <Box display="flex" justifyContent="center" marginTop={2}>
                <img src={preview} width="316px" alt="Preview" />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={handleSelectImage}>
            Chọn ảnh
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export const LGDetailCard = ({ color, sizes, details, lgName, onUpdate, onDelete }) => {
  return (
    <Card className="mb-3">
      <CardContent>
        <Typography variant="h6">{`Chi tiết ${lgName} - Màu: ${color.name}`}</Typography>
        <Box mt={2}>
          {details.map((detail) => (
            <Box
              key={detail.id}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mb={2}
            >
              <Typography>{`Kích cỡ: ${sizes.find((size) => size.id === detail.sizeId)?.name}`}</Typography>
              <Typography>{`Số lượng: ${detail.quantity}`}</Typography>
              <Box>
                <IconButton onClick={() => onUpdate(detail.id)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => onDelete(detail.id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export const LGColorSizeSelector = ({ colorSelected, sizeSelected, onColorSelect, onSizeSelect }) => {
  const [colorDialog, setColorDialog] = useState(false);
  const [sizeDialog, setSizeDialog] = useState(false);

  return (
    <Paper elevation={3} className="mt-4 bg-light rounded-3">
      <Box display="flex" justifyContent="center" p={2}>
        <Typography variant="h5">Màu sắc & kích cỡ</Typography>
      </Box>
      <Box p={3}>
        <Color
          colorSelect={colorSelected}
          onAddColor={onColorSelect}
          open={colorDialog}
          onClose={() => setColorDialog(false)}
          onOpen={() => setColorDialog(true)}
        />
        <Size
          SizeSelect={sizeSelected}
          onAddSize={onSizeSelect}
          open={sizeDialog}
          onClose={() => setSizeDialog(false)}
          onOpen={() => setSizeDialog(true)}
        />
      </Box>
    </Paper>
  );
};

export const ColorSelector = ({ selected, onSelect, open, onClose, onOpen }) => (
  <div>
    <button onClick={onOpen}>Chọn màu</button>
    {open && (
      <div>
        {/* Thay logic tùy chọn màu sắc tại đây */}
        <p>Color Dialog</p>
        <button onClick={() => onSelect([{ id: '1', name: 'Red' }])}>Chọn màu đỏ</button>
        <button onClick={onClose}>Đóng</button>
      </div>
    )}
  </div>
);
