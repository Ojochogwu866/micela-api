# Micela Pay - API

## Overview

Micela Pay API is the backbone of the financial transaction platform, built with Node.js and TypeScript. It leverages the Chimoney API to facilitate secure money transfers, receipts, and transaction management.

![API Structure](https://imgur.com/a/G71BeUO)

## Key Features

- Robust Express-based authentication system
- Seamless integration with Chimoney API for financial operations
- User management and search functionality
- Secure money transfer between users
- Email-based payment receipt system
- Real-time balance enquiry and transaction history

## Technology Stack

- Node.js
- TypeScript
- Express.js
- MongoDB for data persistence
- JSON Web Tokens (JWT) for authentication
- Chimoney API for financial transactions

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MongoDB
- Chimoney API credentials

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/Ojochogwu866/Chi_api.git
   cd Chi_api
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables:
   Copy `.env.example` to `.env` and fill in the required values, including your Chimoney API credentials.

### Running the API

1. Start the server:
   ```
   npm start
   ```
2. The API will be available at `http://localhost:8080`

## Testing

Run the test suite with:

```
npm test
```

## Deployment

Deployment instructions for various platforms can be found in [DEPLOYMENT.md](DEPLOYMENT.md).

## Frontend Integration

This API is designed to work with our [Micela Pay Frontend](https://github.com/Ojochogwu866/chi-money-fullstack). Refer to the frontend repository for UI implementation details.

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for more details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For any technical issues or questions, please open an issue in this repository or contact our support team.
