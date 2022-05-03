import { useEffect, useState } from 'react';
import { useWeb3 } from '../../web3'

export const useAccount = () => {
  const [account, setAccount] = useState<string>();

  const web3 = useWeb3();

  useEffect(() => {
    web3.eth.getAccounts().then(console.info).catch(console.error);
    setAccount('');
  }, [web3]);

  return { account };
};
