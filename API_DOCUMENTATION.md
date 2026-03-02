# E-Commerce Backend API Documentation

## Base URL

`http://localhost:3000/api`

## Authentication

Most endpoints require authentication.

- **Header**: `Authorization`
- **Value**: `Bearer <your_jwt_token>`

---

## 1. Users

### Register User

- **Endpoint**: `POST /users/register`
- **Access**: Public
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phoneNumber": "1234567890" // Optional
  }
  ```

### Login User

- **Endpoint**: `POST /users/login`
- **Access**: Public
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**: Returns a JWT token.

### Get User Profile

- **Endpoint**: `GET /users/:userId`
- **Access**: Private (User or Admin)

### Update User Profile

- **Endpoint**: `PUT /users/:userId`
- **Access**: Private (User or Admin)
- **Body**:
  ```json
  {
    "name": "John Updated",
    "email": "john_new@example.com",
    "phoneNumber": "0987654321"
  }
  ```

### Get All Users (Admin)

- **Endpoint**: `GET /users`
- **Access**: Admin Only
- **Query Params**: `?page=1&limit=10`

### Add Admin (Admin)

- **Endpoint**: `POST /users/addadmin`
- **Access**: Admin Only
- **Body**: Same as Register.

### Deactivate User (Admin)

- **Endpoint**: `PUT /users/deactivate/:userId`
- **Access**: Admin Only

---

## 2. Products

### Get All Products

- **Endpoint**: `GET /products`
- **Access**: Public
- **Query Params**:
  - `page`: Page number (default 1)
  - `limit`: Items per page (default 100)
  - `search`: Search by product name

### Add Product (Admin)

- **Endpoint**: `POST /products/addproduct`
- **Access**: Admin Only
- **Body**:
  ```json
  {
    "name": "Gaming Laptop",
    "price": 1200,
    "description": "High performance laptop",
    "image": "http://image-url.com/img.png",
    "stock": 50
  }
  ```

### Update Product (Admin)

- **Endpoint**: `PUT /products/:productId`
- **Access**: Admin Only
- **Body**: Any field from Add Product.

### Delete Product (Admin)

- **Endpoint**: `DELETE /products/:productId`
- **Access**: Admin Only

---

## 3. Cart

### Get Cart

- **Endpoint**: `GET /cart`
- **Access**: Private
- **Response**: Returns cart items with populated product details.

### Add Item to Cart

- **Endpoint**: `POST /cart`
- **Access**: Private
- **Description**: Adds item or increments quantity by 1 if it exists.
- **Body**:
  ```json
  {
    "productId": "64f8a..."
  }
  ```

### Update Cart Item Quantity

- **Endpoint**: `PUT /cart`
- **Access**: Private
- **Description**: Sets the exact quantity for an item.
- **Body**:
  ```json
  {
    "productId": "64f8a...",
    "quantity": 5
  }
  ```

### Remove Item from Cart

- **Endpoint**: `DELETE /cart`
- **Access**: Private
- **Body**:
  ```json
  {
    "productId": "64f8a..."
  }
  ```

### Clear Cart

- **Endpoint**: `DELETE /cart/clear`
- **Access**: Private

---

## 4. Orders

### Create Order (Checkout)

- **Endpoint**: `POST /orders`
- **Access**: Private
- **Description**: Creates an order from the current cart, deducts stock, and clears the cart.
- **Body**:
  ```json
  {
    "shippingAddress": "123 Main St, City, Country",
    "paymentMethod": "Credit Card"
  }
  ```

### Get My Orders

- **Endpoint**: `GET /orders`
- **Access**: Private
- **Response**: List of orders placed by the logged-in user.

### Get All Orders (Admin)

- **Endpoint**: `GET /orders/all`
- **Access**: Admin Only

### Update Order Status (Admin)

- **Endpoint**: `PATCH /orders/:id/status`
- **Access**: Admin Only
- **Body**:
  ```json
  {
    "status": "Shipped" // Options: Pending, Processing, Shipped, Delivered, Cancelled
  }
  ```

---

## Error Handling

Errors are returned in the following JSON format:

```json
{
  "status": "fail" or "error",
  "message": "Error description here"
}
```
