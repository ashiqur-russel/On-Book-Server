<div align="center">

<a name="readme-top"></a>

# Book Shop (REST API)

The Book Store REST-API is an Express-based application designed to manage books and orders efficiently. This project is built with TypeScript, integrates MongoDB using Mongoose, and emphasizes schema validation and proper error handling.The API provides endpoints for creating, reading, updating, and deleting books and orders, as well as calculating total revenue using MongoDB aggregation.

[![Express][express_img]][express_url]
[![TypeScript][typescript_img]][typescript_url]
[![MongoDB][mongodb_img]][mongodb_url]
[![Mongoose][mongoose_img]][mongoose_url]

</div>

## ✨ Features

### Products(Book)

- Create new product with properties such as title, author, price, category, description, quantity, and stock status.
- Fetch all product or filter them by title, author, or category.
- Retrieve specific product details of a specific book using its unique ID.
- Update book details like price, quantity, and stock status.
- Delete books, marking them as unavailable without permanently removing them.

### Orders

- Create orders by specifying customer email, product ID, and quantity.
- Automatically reduce product quantity after an order and update the stock status (inStock).
- Revenue Calculation.

## Data Flow 

The following diagram represents the flow of data and interactions:

 <div align="center">
   
    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
    │   Interface  │ →  │    Schema    │ →  │     Model    │ →  │   DB Query   │
    └──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
   
 </div>

### API Endpoint

 <div align="center">
    <h3>Products</h2>

| Method   | URI                        | Action                                        |
| -------- | -------------------------- | --------------------------------------------- |
| `POST`   | `/api/products`            | Create a new book                             |
| `GET`    | `/api/products`            | Retrieve all books, filterable by searchTerm  |
| `GET`    | `/api/products/:productId` | Retrieve details of a specific book by its ID |
| `PUT`    | `/api/products/:productId` | Update details of a specific book by its ID   |
| `DELETE` | `/api/products/:productId` | Soft-delete a specific book by its ID         |

</div>

 <div align="center">
    <h3>Orders</h2>
   
| Method     | URI                  | Action                                                 |
| ---------- | -------------------- | ------------------------------------------------------ |
| `POST`     | `/api/orders`        | Place a new order                                      |
| `GET`      | `/api/orders/revenue`| Calculate total revenue from all orders                |
 </div>

## ⚡️ Quick start ( Localhost )

To get started with this project on your local machine, follow these steps:

1.Clone the Repository:

```bash
git clone https://github.com/ashiqur-russel/Book-Shop.git
cd Book-Shop
```

2.Install Dependencies: Install the required packages using npm:

```bash
npm install
```

3.Create Environment Variables: At the root directory of your project, create a .env file with the following content:

```bash
DATABASE_URL=<Your MongoDB Atlas URI>
PORT=5000 # any port number here you can enter
```

4.Run the Server: Start the development server with the following command:

```bash
npm run start:dev
```

5.Access the API: Open your browser or Postman and navigate to:

```bash
http://localhost:5000
```

Now you are set to go and can interact with the API endpoints.

[express_img]: https://img.shields.io/badge/Express.js-404D59?style=for-the-badge
[express_url]: https://expressjs.com/
[typescript_img]: https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white
[typescript_url]: https://www.typescriptlang.org/
[mongodb_img]: https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white
[mongodb_url]: https://www.mongodb.com/
[mongoose_img]: https://img.shields.io/badge/Mongoose-880000?style=for-the-badge
[mongoose_url]: https://mongoosejs.com/

