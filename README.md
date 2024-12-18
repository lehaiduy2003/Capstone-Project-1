![Node Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)
![npm Version](https://img.shields.io/badge/npm-%3E%3D6.0.0-brightgreen)
![Last Commit](https://img.shields.io/github/last-commit/lehaiduy2003/Capstone-Project-1)

<hr/>
## Project Information

### Project Name

EcoTrade

### Description

EcoTrade is a mobile application platform designed to facilitate eco-friendly trading and promote sustainable practices.
The application aims to connect users who are interested in trading eco-friendly products and services.

### Technologies Used

- **Package Manager**: npm
- **Languages**: JavaScript, TypeScript
- **Frameworks**: React Native, Expo, Express
- **Databases**: MongoDB, Redis
- **Services**: Firebase, Twilio, Stripe, Shippo

### Repository

- **GitHub Repository**: [Capstone-Project-1](https://github.com/lehaiduy2003/Capstone-Project-1)
- **Branch**: main
- **Remote**: origin

<hr/>
## Team Information

### Team Name

C1SE.43

### Team Members

- **Member 1**: Le Hai Duy - [GitHub](https://github.com/lehaiduy2003)
- **Member 2**: Dang Van Thoi Dai - [GitHub](https://github.com/thoidai12234556)
- **Member 3**: Phung Minh Nghia - [GitHub](https://github.com/phungminhnghia)
- **Member 4**: Le Trung Hieu - [GitHub](https://github.com/trhieu2310)
- **Member 5**: Nguyen Anh Vu - [GitHub](https://github.com/vunguyenDev92)

<hr/>
This document provides an overview of the EcoTrade project and the C1SE.43 team.

## How to Use the Project

### Prerequisites

Ensure you have the following installed on your system:

- **Node.js (v14.x or later)**
- **npm (v6.x or later)**
- **Expo CLI (`npm install -g expo-cli`)**

### Installation

1. **Clone the repository:**
    ```sh
    git clone https://github.com/lehaiduy2003/Capstone-Project-1.git
    cd Capstone-Project-1
    ```

2. **Install dependencies for both client and server:**
    ```sh
      cd client
      npm install
      cd ../server
      npm install
    ```

### Environment Variables

Ensure you have a `.env` file in the root directory with the following of `.env.example` file

### Running the Project

#### Client

1. **Start the Expo development server:**
   ```sh
   cd client
   npm start
   ```

2. **Run on Android:**
   ```sh
   npm run android
   ```

3. **Run on iOS:**
   ```sh
   npm run ios
   ```

4. **Run on Web:**
   ```sh
   npm run web
   ```

#### Server

1. **Start the Express server:**
   ```sh
   cd server
   npm start
   ```

### Testing

#### Client

To run tests for the client, use the following command:

```sh
cd client
npm test
```

#### Server

To run tests for the server, use the following command:

```sh
cd server
npm test
```

### Directory Structure

#### Client Directory Structure

- `client/`: Contains the React Native client application.
    - `app/`: Contains the main application components and screens.
    - `components/`: Reusable components used across the application.
    - `hooks/`: Custom hooks for the application.
    - `utils/`: Utility functions and helpers.
    - `styles/`: Contains style definitions for the application.
    - `assets/`: Contains static assets like images and fonts.
    - `scripts/`: Contains utility scripts for project maintenance.
    - `package.json`: Contains the dependencies and scripts for the client application.

#### Server Directory Structure

- `server/`: Contains the Express server application.
    - `src/`: Contains the source code for the server.
        - `middlewares/`: Contains middleware functions.
        - `config/`: Contains configuration files and databases connection.
        - `utils/`: Utility functions and helpers.
        - `Modules`: Contains MVC modules.
        - `setup/`: Contains setup scripts and initial configurations.
        - `server.ts`: The main file to run the server application.
    - `tests/`: Contains the test cases for the server application.
    - `global.d.ts`: Contains global type definitions.
    - `package.json`: Contains the dependencies and scripts for the server application.

### Additional Information

For more details, refer to the [GitHub Repository](https://github.com/lehaiduy2003/Capstone-Project-1).

<hr/>
