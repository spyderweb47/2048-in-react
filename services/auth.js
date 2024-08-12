export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      return accounts[0];
    } catch (error) {
      console.error("User rejected the connection", error);
      return null;
    }
  } else {
    console.error("Ethereum wallet is not installed");
    return null;
  }
};

// export default function ConnectButton() {
//   return <w3m-button />
// }

export const getWalletAddress = async () => {
  if (window.ethereum) {
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    return accounts[0];
  }
  return null;
};

export const disconnectWallet = () => {
  // Clearing wallet state to simulate disconnect
  localStorage.removeItem('walletAddress');  // if you are saving the wallet address in localStorage
  window.location.reload(); // Refresh the page to reset state in your app
};
