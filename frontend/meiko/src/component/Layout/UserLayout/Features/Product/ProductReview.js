import React, { useState, useEffect } from 'react';
import { Avatar, Rating } from '@mui/material';
import { Button, Form, Alert, Image } from 'react-bootstrap';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import DeleteIcon from '@mui/icons-material/Delete';
import styles from './ProductReviews.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState(null);
  const customerId = localStorage.getItem('customerId');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`https://localhost:7172/api/Review/${productId}`);
        if (!response.ok) throw new Error('Không thể tải đánh giá');
        const data = await response.json();
        setReviews(data);
        setLoading(false);
      } catch (err) {
        setError('Có lỗi xảy ra khi tải đánh giá');
        setLoading(false);
      }
    };

    const fetchUserData = async () => {
      try {
        if (!customerId) return;
        const response = await fetch(`https://localhost:7172/api/Customer/Get/${customerId}`);
        if (!response.ok) throw new Error('Không thể tải thông tin người dùng');
        const data = await response.json();
        setUserData({
          avatar: data.avatar || 'default-avatar-url',
          name: data.name || 'Người dùng chưa xác định',
        });
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };

    fetchUserData();
    fetchReviews();
  }, [productId, customerId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerId) {
      toast.error('Bạn cần đăng nhập để gửi đánh giá');
      return;
    }

    if (newReview.rating < 1 || newReview.rating > 5) {
      toast.error('Đánh giá phải trong khoảng từ 1 đến 5');
      return;
    }

    if (newReview.comment.length < 10) {
      toast.error('Bình luận phải có ít nhất 10 ký tự');
      return;
    }

    const reviewWithCustomerId = {
      id: "1caa17b9-bfa7-4ea7-9dff-83319ed864f5", 
      productId: productId,
      customerId: customerId,
      comment: newReview.comment,
      rating: newReview.rating,
      createdAt: new Date().toISOString(),
      customerName: userData?.name || 'Người dùng chưa xác định',
      customerAvatar: userData?.avatar || 'default-avatar-url',
      parentReviewId: null,
      status: 0, 
      helpfulCount: 0,
      unhelpfulCount: 0,
      userInteractions: {},
    };

    try {
      const response = await fetch(`https://localhost:7172/api/Review/Create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewWithCustomerId),
      });

      if (!response.ok) throw new Error('Không thể gửi đánh giá');
      const data = await response.json();
      setReviews((prevReviews) => [data, ...prevReviews]);
      setNewReview({ rating: 0, comment: '' });
      toast.success('Đánh giá đã được gửi thành công');
    } catch (err) {
      toast.error('Có lỗi xảy ra khi gửi đánh giá');
    }
  };

  const handleHelpful = async (reviewId, isHelpful) => {
    if (!customerId) {
      toast.error('Bạn cần đăng nhập để thực hiện hành động này.');
      return;
    }

    try {
      const userInteraction = reviews.find((review) => review.id === reviewId)?.userInteractions?.[customerId];

      if (userInteraction) {
        toast.info('Bạn đã đánh giá rồi!');
        return;
      }

      const updatedReview = { ...reviews.find((review) => review.id === reviewId) };

      if (isHelpful) {
        updatedReview.helpfulCount += 1;
      } else {
        updatedReview.unhelpfulCount += 1;
      }

      if (!updatedReview.userInteractions) {
        updatedReview.userInteractions = {};
      }
      updatedReview.userInteractions[customerId] = isHelpful ? 'like' : 'dislike';

      const response = await fetch(`https://localhost:7172/api/Review/Update/${reviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedReview),
      });

      if (!response.ok) throw new Error('Cập nhật đánh giá không thành công');

      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === reviewId ? updatedReview : review
        )
      );
      toast.success('Cập nhật thành công!');
    } catch (err) {
      toast.error('Có lỗi xảy ra khi cập nhật đánh giá');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bình luận này không?')) {
      try {
        const response = await fetch(`https://localhost:7172/api/Review/Delete/${reviewId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Không thể xóa đánh giá');
        }

        setReviews((prevReviews) => prevReviews.filter((review) => review.id !== reviewId));
        toast.success('Đánh giá đã được xóa thành công');
      } catch (err) {
        toast.error('Có lỗi xảy ra khi xóa đánh giá');
      }
    }
  };

  const timeAgo = (createdAt) => {
    const now = new Date();
    const timeDiff = now - new Date(createdAt);
    const minutes = Math.floor(timeDiff / (1000 * 60));
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    return `${days} ngày trước`;
  };

  if (loading) return <div>Đang tải đánh giá...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className={`container ${styles.container}`}>
      <h3 className="mb-4">Đánh giá sản phẩm</h3>
  
      <div
        className="scrollable-container mb-4"
        style={{ maxHeight: reviews.length > 5 ? '400px' : 'none', overflowY: reviews.length > 5 ? 'auto' : 'visible' }}
      >
        {reviews.length > 0 ? (
          <ul className="list-unstyled">
            {reviews.map((review, index) => (
              <li key={index} className={`${styles.reviewItem} mb-3`}>
                <div className="d-flex flex-column">
                  <div className="d-flex align-items-center">
                    <Avatar {...stringAvatar(review.customerName)} />
                    <div className="ms-3">
                      <strong className={styles.reviewName}>
                        {review.customerName || 'Người dùng chưa xác định'}
                      </strong>
                      <span className={styles.timeSet}>
                        ({timeAgo(review.createdAt)})
                      </span>
                    </div>
                    {review.customerId === customerId && (
                      <Button
                        style={{marginLeft: "550px"}}
                        variant="danger"
                        size="sm"
                        className={styles.deleteButton}
                        onClick={() => handleDeleteReview(review.id)}
                      >
                        <DeleteIcon />
                      </Button>
                    )}
                  </div>
  
                  <div className={styles.rating}>
                    <Rating name="read-only" value={review.rating} readOnly />
                  </div>
  
                  <p className={styles.reviewComment}>{review.comment}</p>
  
                  <div className={styles.helpfulCounts}>
                    <button
                      className={`${styles.helpfulButton} text-success`}
                      onClick={() => handleHelpful(review.id, true)}
                      disabled={review.userInteractions?.[customerId] === 'like'}
                    >
                      <ThumbUpIcon /> {review.helpfulCount}
                    </button>
                    |
                    <button
                      className={`${styles.helpfulButton} text-danger`}
                      onClick={() => handleHelpful(review.id, false)}
                      disabled={review.userInteractions?.[customerId] === 'dislike'}
                    >
                      <ThumbDownIcon /> {review.unhelpfulCount}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.noReviews}>Chưa có đánh giá nào</p>
        )}
      </div>
  
      <h4>Đánh giá của bạn</h4>
      <form onSubmit={handleSubmit}>
        <Form.Group className={`${styles.formGroup} mb-4`}>
          <Form.Label className={styles.formLabel}>Đánh giá:</Form.Label>
          <Rating
            name="rating"
            value={newReview.rating}
            onChange={(event, newValue) => setNewReview({ ...newReview, rating: newValue })}
            max={5}
            className={styles.rating}
          />
        </Form.Group>
  
        <Form.Group className={`${styles.formGroup} mb-4`}>
          <Form.Label className={styles.formLabel}>Bình luận:</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            minLength="10"
            required
            className={styles.formControl}
          />
        </Form.Group>
  
        <Button variant="primary" type="submit" className={styles.submitButton}>
          Gửi đánh giá
        </Button>
      </form>
  
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar newestOnTop rtl={false} pauseOnFocusLoss pauseOnHover />
    </div>
  );
  
  
};

function stringAvatar(name) {
  if (!name || typeof name !== 'string') {
    return {
      sx: {
        bgcolor: '#ccc',
      },
      children: '?',
    };
  }

  const initials = name
    .split(' ') 
    .map(word => word[0]) 
    .join('');

  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: initials.length === 1 ? initials : initials.substring(0, 2), 
  };
}

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

export default ProductReviews;
