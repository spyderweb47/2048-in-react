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
  
  export const getWalletAddress = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      return accounts[0];
    }
    return null;
  };
  