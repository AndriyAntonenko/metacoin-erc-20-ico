import { useState, useCallback } from 'react';

export const useBuyTokens = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [amount, setAmount] = useState<string>();

  const buyTokens = useCallback(async () => {
    try {
      setLoading(true);
      await setTimeout(() => { console.info({ amount }); }, 2000);
      setLoading(false); 
    } catch (err) {
      setErrorMessage((err as Error).message);      
    }
  }, [setLoading, amount]);

  return {
    errorMessage,
    loading,
    setAmount,
    amount,
    buyTokens
  };
};
