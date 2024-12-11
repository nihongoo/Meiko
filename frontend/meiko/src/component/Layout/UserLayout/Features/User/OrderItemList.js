import OrderItem from "./OrderItem.js";

const OrderItemList = ({ orders }) => {
  return (
    <div>
      {orders?.map((order) => (
        <div key={order.id}>
          <OrderItem order={order} />
          <hr />
        </div>
      ))}
    </div>
  );
};

export default OrderItemList;
