# Blockchain Chat DApp

## How to Run This Project

### 1. Prerequisites
- Node.js installed.
- MetaMask extension installed in your browser.

### 2. Setup
This project consists of two parts: the **Smart Contract** and the **Frontend Client**. You need to set up both.

#### Open the Project
Open this folder in your code editor (e.g., VS Code).

#### Terminal 1: Smart Contract
1. Open a terminal and navigate to the `smart_contract` folder:
   ```bash
   cd smart_contract
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the local blockchain node:
   ```bash
   npx hardhat node
   ```
   *Keep this terminal running.*

#### Terminal 2: Deploy Contract
1. Open a **new** terminal.
2. Navigate to the `smart_contract` folder:
   ```bash
   cd smart_contract
   ```
3. Deploy the contract to your local node:
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```

#### Terminal 3: Frontend Client
1. Open a **new** terminal.
2. Navigate to the `client` folder:
   ```bash
   cd client
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### 3. Use the App
- Open your browser and go to [http://localhost:3000](http://localhost:3000).
- **Import Account to MetaMask**:
  - Copy one of the private keys from the "Terminal 1" output (Account #0, #1, etc.).
  - Open MetaMask > Click Account Menu > "Import Account" > Paste Private Key.
  - Switch MetaMask network to **Localhost 8545**.
- Connect your wallet and start chatting!
