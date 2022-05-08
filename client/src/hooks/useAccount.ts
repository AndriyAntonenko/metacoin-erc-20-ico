import { useEffect, useState } from 'react';
import { useWeb3 } from '../web3'

export const useAccount = () => {
  const [account, setAccount] = useState<string>();

  const web3 = useWeb3();

  useEffect(() => {
    web3.eth.getAccounts()
      .then(([acc]) => setAccount(acc))
      .catch(console.error);
  }, [web3]);

  return { account };
};
