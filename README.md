# Webapp
demo

## Overview

This web application provides a robust backend service with RESTful APIs for user management. It follows best practices for security, authentication, and database management. Below are the key features and requirements implemented in the application:

### Bootstrapping Database

The application automates the database setup at startup, creating and updating schema, tables, indexes, and sequences. Manual SQL script execution is not required, and the use of ORM frameworks, specifically Sequelize for Node.js, ensures efficient database management.

### Implemented APIs

- Token-Based Authentication: The web application exclusively supports Token-Based authentication, offering a secure means of user validation.

#### Swagger Docs

The application includes Swagger documentation for clear API reference and usage guidance- https://app.swaggerhub.com/apis-docs/csye6225-webapp/cloud-native-webapp/2024.spring.02

#### Create a New User

- Users can create an account by providing essential information:
  Email Address, Password, First Name, Last Name
- The account_created field is set to the current time upon successful user creation.
- Values for account_created and account_updated provided by users are ignored.
- Passwords are securely stored using the BCrypt hashing scheme with salt.
- The application returns a 400 Bad Request HTTP response code for duplicate email addresses.

#### Get User Information

- Users can retrieve their account information.
- The response payload includes all user fields except for the password.

#### Update User Information

- Users can update their account information, limited to the following fields:
  First Name, Last Name, Password
- Attempting to update other fields results in a 400 Bad Request HTTP response code.
- The account_updated field is updated upon a successful user update.

### Continuous Integration (CI) with GitHub Actions

The application is equipped with GitHub Actions workflows, ensuring code integrity and quality:

- A simple check (compile code) is run for each pull request, preventing merging if the workflow fails.
- Status Checks in GitHub branch protection prevent merging a pull request when the GitHub Actions workflow execution is unsuccessful.

## Prerequisites

Ensure you have the following software/tools installed on your machine:

- Node.js
- npm (Node Package Manager, included with Node.js)
- PostgreSQL Database

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo

### 2. Install Dependencies
npm install

### 3. Run the Application
node app.js
```
