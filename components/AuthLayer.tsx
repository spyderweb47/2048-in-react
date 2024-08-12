import React, { useEffect, useState } from "react";
import { useAccount } from 'wagmi';
import axios from 'axios';

interface AuthLayerProps {
  children: React.ReactNode;
}

const AuthLayer: React.FC<AuthLayerProps> = ({ children }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSettingUsername, setIsSettingUsername] = useState(false); // New state to track username setting
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (isConnected && address) {
      // Fetch user data based on wallet address
      axios.get(`/api/auth?wallet=${address}`)
        .then(response => {
          if (response.data.username) {
            setUsername(response.data.username);
          }
          setLoading(false);
        })
        .catch(error => {
          console.error("Error fetching user data:", error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [isConnected, address]);

  const handleSetUsername = async (name: string) => {
    if (address) {
      setIsSettingUsername(true); // Start loading when setting username
      try {
        await axios.post('/api/auth', { wallet: address, username: name });
        setUsername(name);
      } catch (error) {
        console.error("Error setting username:", error);
      } finally {
        setIsSettingUsername(false); // Stop loading after username is set
      }
    }
  };

  if (loading || isSettingUsername) {
    return <div>Loading...</div>; // Show loading while fetching or setting username
  }

  if (!isConnected) {
    return <div>Please connect your wallet to continue.</div>;
  }

  if (!username) {
    return (
      <div>
        <h2>Enter Username</h2>
        <input
          type="text"
          placeholder="Enter username"
          onBlur={(e) => handleSetUsername(e.target.value)}
        />
      </div>
    );
  }

  return (
    <div>
      {React.cloneElement(children as React.ReactElement<any>, { username, wallet: address })}
    </div>
  );
};

export default AuthLayer;
