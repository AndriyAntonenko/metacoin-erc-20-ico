import { useState, useCallback } from 'react';
import BN from 'bn.js';
import { useAccount, useICOInfo } from '../../hooks';
import { useMetacoinSale } from '../../web3/contracts';

export const useBuyTokens = () => {
  const { account } = useAccount();
  const MetacoinSale = useMetacoinSale();
  const { tokenPrice } = useICOInfo();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [amount, setAmount] = useState<string>();

  const buyTokens = useCallback(async () => {
    if (!tokenPrice || !amount) return
    try {
      setLoading(true);
      await MetacoinSale.methods.buyTokens(amount).send({
        from: account,
        value: new BN(amount).mul(tokenPrice)
      });
      setLoading(false); 
    } catch (err) {
      setErrorMessage((err as Error).message);      
    }
  }, [setLoading, amount, MetacoinSale, tokenPrice, account]);

  return {
    errorMessage,
    loading,
    setAmount,
    amount,
    buyTokens
  };
};
