import React, { useEffect, useState, ReactNode } from "react";
import { connectWallet, getWalletAddress } from "@/services/auth";
import axios from 'axios';

interface AuthLayerProps {
  children: ReactNode;
}

const AuthLayer: React.FC<AuthLayerProps> = ({ children }) => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [username, setUsernameState] = useState<string | null>(null);
  const [wallet, setWalletState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const wallet = await getWalletAddress();
      if (wallet) {
        setWalletConnected(true);
        setWalletState(wallet);
        const response = await axios.get(`/api/auth?wallet=${wallet}`);
        setUsernameState(response.data.username);
      }
      setLoading(false);
    }
    checkAuth();
  }, []);

  const handleConnectWallet = async () => {
    const wallet = await connectWallet();
    if (wallet) {
      setWalletConnected(true);
      setWalletState(wallet);
      const response = await axios.get(`/api/auth?wallet=${wallet}`);
      setUsernameState(response.data.username);
    }
  };

  const handleSetUsername = async (name: string) => {
    const wallet = await getWalletAddress();
    if (wallet) {
      await axios.post('/api/auth', { wallet, username: name });
      setUsernameState(name);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!walletConnected) {
    return (
      <div>
        <button onClick={handleConnectWallet}>Connect Wallet</button>
      </div>
    );
  }

  if (!username) {
    return (
      <div>
        <h2>Enter Username</h2>
        <input type="text" placeholder="Enter username" onBlur={(e) => handleSetUsername(e.target.value)} />
      </div>
    );
  }

  return (
    <>
      {React.cloneElement(children as React.ReactElement<any>, { username, wallet })}
    </>
  );
};

export default AuthLayer;
