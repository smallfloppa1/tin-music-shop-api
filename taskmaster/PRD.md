# Product Requirements Document (PRD): "Harmony Hub" Music Store

**Version:** 1.0
**Status:** Draft
**Author:** [Your Name]
**Date:** October 26, 2023

---

## 1. Project Overview

### 1.1. Problem Statement
Current generic e-commerce platforms are often bloated and complex for small-scale instrument shops. There is a need for a lightweight, demonstrative web application that allows a music shop to display inventory and allows customers to simulate purchasing instruments, serving as a proof-of-concept for university evaluation.

### 1.2. Target Users
* **The Customer:** A user who wants to browse instruments, view details, manage a shopping cart, and place orders.
* **The Administrator:** The store owner who needs to manage the product catalog (add, edit, delete instruments) and view incoming orders.

### 1.3. Value Proposition
A clean, responsive Single Page Application (SPA) that provides a seamless shopping experience for musicians, built on a robust, type-safe backend architecture.

---

## 2. Goals and Objectives

### 2.1. Primary Goals
* Build a RESTful API using **NestJS**.
* Create a responsive frontend using **React**.
* Implement relational data modeling using **MySQL**.
* Demonstrate full CRUD (Create, Read, Update, Delete) capabilities.

### 2.2. Success Metrics
* **Functionality:** Users can successfully register, login, add items to a cart, and "checkout" (create an order).
* **Performance:** API response times under 200ms for standard queries.
* **Code Quality:** Clean separation of concerns (Controllers, Services, Repositories).

---

## 3. User Stories

| Priority | Actor | Story | Acceptance Criteria |
| :--- | :--- | :--- | :--- |
| **P0** | User | As a user, I want to register and login. | Receive JWT token upon login; access protected routes. |
| **P0** | Customer | As a customer, I want to view a list of products. | Grid view with image, name, and price. |
| **P0** | Customer | As a customer, I want to add items to my cart. | Item appears in cart state; cart persists (DB or LocalStorage). |
| **P0** | Customer | As a customer, I want to place an order. | Order saved to DB; Cart cleared; Stock reduced. |
| **P1** | Admin | As an admin, I want to add new instruments. | Form to input Name, Price, Description, Image URL, Category. |
| **P1** | Admin | As an admin, I want to edit/delete instruments. | Update price/stock or remove item from catalog. |
| **P2** | Customer | As a customer, I want to filter products by category. | Filter by "Guitars", "Drums", "Keyboards". |

*(Note: **P0** = Must have for MVP, **P1** = Important, **P2** = Nice to have)*

---

## 4. Features and Requirements

### 4.1. Authentication Module
* **Backend:** JWT (JSON Web Token) implementation using Passport strategy in NestJS.
* **Frontend:** Login/Register forms. Store token in LocalStorage/Cookies.
* **Roles:** Basic role-based access control (User vs. Admin).

### 4.2. Product Catalog (Public)
* **List View:** Grid display of instruments.
* **Detail View:** Dedicated page showing full description, stock status, and "Add to Cart" button.
* **Search/Filter:** Basic text search or category dropdown (e.g., Strings, Percussion, Wind).

### 4.3. Shopping Cart & Checkout
* **Cart Management:** Ability to increase/decrease quantity or remove items.
* **Checkout Process:** A simple "Place Order" button.
    * *Note: For this MVP, do not integrate real payment gateways (Stripe/PayPal). Mock the payment as "Successful" immediately.*
* **Order Creation:** System must generate an `Order` record and `OrderItems` in MySQL.

### 4.4. Admin Management Panel
* **Product Dashboard:** Table view of all products with Edit/Delete actions.
* **Add Product Form:** Inputs for: Title, Description, Price, Stock Quantity, Category, Image URL.
    * *Note: To save time, use Image URLs (linking to external images) rather than building a file upload server.*

---

## 5. Technical Requirements

### 5.1. Backend (NestJS)
* **Framework:** NestJS (Node.js).
* **ORM:** TypeORM or Prisma (TypeORM is standard for NestJS).
* **Validation:** `class-validator` and DTOs (Data Transfer Objects) for all inputs.
* **API Structure:**
    * `POST /auth/login`
    * `GET /products`
    * `POST /products` (Admin only)
    * `POST /orders` (Authenticated users)

### 5.2. Frontend (React)
* **State Management:** Context API or Redux Toolkit (Context is sufficient for this scope).
* **Routing:** React Router v6.
* **Styling:** CSS Modules, Tailwind CSS, or Material UI (Recommended: Tailwind for speed).
* **HTTP Client:** Axios.

### 5.3. Database (MySQL)
* **Tables:**
    * `Users` (id, email, password_hash, role)
    * `Products` (id, name, description, price, stock, category, image_url)
    * `Orders` (id, user_id, total_amount, status, created_at)
    * `OrderItems` (id, order_id, product_id, quantity, price_at_purchase)

---

## 6. Design Considerations

* **Responsiveness:** The layout must adapt to mobile screens (flexbox/grid).
* **Feedback:** Use "Toast" notifications for actions (e.g., "Item added to cart", "Login failed").
* **Simplicity:** Minimalist design. Use free component libraries (like ShadCN or MUI) to avoid spending too much time on CSS.

---

## 7. Success Criteria

1.  **Code Compilation:** Project builds and runs locally without crashing.
2.  **Database Integrity:** Foreign keys connect Orders to Users and OrderItems to Products correctly.
3.  **User Flow:** A completely new user can register, find a guitar, and buy it without hitting a console error.

---

## 8. Risks and Mitigations

| Risk | Impact | Mitigation |
| :--- | :--- | :--- |
| **Scope Creep** | Project exceeds 2-week timeline. | Strictly adhere to P0/P1 features. Cut "Search" if running late. |
| **Image Hosting** | Uploading files is complex. | Use external image URLs (e.g., Unsplash links) instead of file uploads. |
| **Auth Complexity** | Getting stuck on security. | Use standard NestJS Passport boilerplate; do not reinvent auth logic. |

---

## 9. Timeline and Milestones (10-Day Plan)

* **Day 1-2: Backend Setup**
    * Initialize NestJS.
    * Setup MySQL Docker container or local DB.
    * Create Entities (User, Product, Order).
* **Day 3-5: API Development**
    * Implement Auth (Login/Register).
    * Implement Product CRUD.
    * Implement Order logic.
    * Test via Postman.
* **Day 6-8: Frontend Implementation**
    * Scaffold React app.
    * Build Components (Navbar, ProductCard, Cart).
    * Connect to API using Axios.
* **Day 9: Integration & Polish**
    * State management (Cart context).
    * Styling fixes.
* **Day 10: Final Review**
    * Code cleanup.
    * Write `README.md` for university submission.

---

## 10. Future Enhancements (Post-Submission)
* Integration with Stripe for real payments.
* Image file upload to AWS S3.
* User reviews and 5-star ratings for instruments.
* Order history page for users to see past purchases.
