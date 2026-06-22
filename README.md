# Clothing E-Commerce Backend API

A scalable and secure RESTful backend API for a clothing eCommerce platform built using Node.js, Express.js, and MongoDB.

This backend powers essential eCommerce functionalities including authentication, product management, cart operations, wishlist handling, payments, order processing, address management, reviews, and admin controls.

---

# Features

## Authentication & User Management
- User Signup & Login
- JWT Authentication
- Password Change
- Forgot Password & Reset Password
- Avatar Upload Support

## Product Management
- Create, Update & Delete Products
- Product Image Uploads with Cloudinary
- Product Categories & Subcategories
- Product Slug Generation
- Product Reviews & Ratings

## Shopping Features
- Add to Cart
- Update Cart Quantity
- Remove Cart Items
- Clear Cart
- Wishlist Management

## Address Management
- Add Multiple Addresses
- Update & Delete Addresses
- Set Default Address

## Order & Payment System
- Create Orders
- Buy Now Feature
- Razorpay Payment Integration
- Payment Verification
- Order Status Updates
- Order Cancellation

## Admin Features
- Manage Products
- Manage Categories & Subcategories
- Manage Orders
- Manage Payments
- Role-based Authorization

---

# Tech Stack

## Backend
- Node.js
- Express.js

## Database
- MongoDB
- Mongoose

## Authentication & Security
- JWT (jsonwebtoken)
- bcryptjs
- validator

## File Upload & Media
- Multer
- Cloudinary

## Payment Integration
- Razorpay

## Email Services
- Nodemailer
- SendGrid SMTP

---

# Project Structure

```bash
backend/
│
├── controllers/
├── routes/
├── models/
├── middleware/
├── config/
├── utils/
├── uploads/
│
├── server.js
├── package.json
├── .env
└── .gitignore
```

---

# Installation

## Clone the Repository

```bash
git clone https://github.com/vermaKanishk01/mern-ecommerce-backend.git
```

## Navigate to Project Directory

```bash
cd mern-ecommerce-backend
```

## Install Dependencies

```bash
npm install
```

---

# Environment Variables

Create a `.env` file in the root directory and add the following:

```env
PORT=3000

MONGO_URI=mongodb://localhost:27017/

JWT_SECRET=your_jwt_secret

CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_secret

EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=your_sendgrid_api_key
EMAIL_FROM=your_email_address

RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret
```

---

# Running the Application

## Development Mode

```bash
npm run dev
```

## Production Mode

```bash
npm start
```

Server runs on:

```bash
http://localhost:3000
```

---

# API Routes

## User Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/signup` | Register User |
| POST | `/api/users/login` | Login User |
| POST | `/api/users/change-password` | Change Password |
| POST | `/api/users/forgot-password` | Forgot Password |
| POST | `/api/users/reset-password/:token` | Reset Password |
| GET | `/api/users/me/` | Get User Profile |
| PUT | `/api/users/reset-password/:token` | Update User Profile |

---

## Product Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get All Products |
| GET | `/api/products/:id` | Get Single Product |
| POST | `/api/products/create` | Create Product(Admin Only) |
| PATCH | `/api/products/:id` | Update Product(Admin Only) |
| DELETE | `/api/products/:id` | Delete Product(Admin Only) |

---

## Category Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | getCategories |
| GET | `/api/categories/:slug` | getCategory |
| POST | `/api/categories` | createCategory(Admin Only) |
| PUT | `/api/categories/:id` | updateCategory(Admin Only) |
| PATCH | `/api/categories/:id` | setCategoryActiveStatus(Admin Only) |

---

## Subcategory Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/subcategories` | getSubCategories |
| GET | `/api/subcategories/category/:categoryId` | getSubCategoriesByCategory |
| POST | `/api/subcategories` | createSubCategory(Admin Only) |
| PUT | `/api/subcategories/:id` | updateSubCategory(Admin Only) |
| DELETE | `/api/subcategories/:id` | deleteSubCategory(Admin Only) |

---

## Cart Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/cart/add` | addToCart |
| GET | `/api/cart` | getCart |
| PUT | `/api/cart/update` | updateCartItem |
| DELETE | `/api/cart/remove` | removeFromCart |
| DELETE | `/api/cart/clear` | clearCart |

---

## Wishlist Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/wishlist` | addToWishlist |
| GET | `/api/wishlist` | getWishlist |
| PATCH | `/api/wishlist/:productId` | removeFromWishlist |
| DELETE | `/api/wishlist` | clearWishlist |

---

## Address Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/address` | addAddress |
| GET | `/api/address` | getAddresses |
| PUT | `/api/address/:id` | updateAddress |
| DELETE | `/api/address/:id` | deleteAddress |
| PUT | `/api/address/default/:id` | setDefaultAddress |

---

## Order Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | createOrder |
| POST | `/api/orders/buy-now` | buyNow |
| GET | `/api/orders/my-orders` | getUserOrders |
| PUT | `/api/orders/:id/cancel` | cancelOrder |
| GET | `/api/orders/` | getAllOrders(Admin Only) |
| PUT | `/api/orders/:id/status` | updateOrderStatus(Admin Only) |

---

## Payment Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payment/create` | createPayment |
| POST | `/api/payment/verify` |  verifyPayment |
| GET | `/api/payment/my` | getUserPayments |
| GET | `api/payment/` | getAllPayments(Admin Only) |
---

## Review Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reviews` | addReview |
| DELETE | `/api/reviews/:id` | deleteReview |
| GET | `/api/reviews/product/:productId` | getProductReviews |

---

# Security Features

- JWT Authentication
- Protected Routes
- Role-based Authorization
- Password Hashing
- Input Validation
- Secure Environment Variables

---

# Author

Developed by Kanishk verma

---
