import OrderItem from "./OrderItem.js";

const OrderItemList = ({ orders }) => {
  return (
    <div>
      {orders?.map((order) => (
        <div>
          <OrderItem key={order.id} order={order} />
          <hr/>
        </div>
      ))}
    </div>
  );
};

export default OrderItemList;

