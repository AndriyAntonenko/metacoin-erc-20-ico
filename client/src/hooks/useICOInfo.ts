import { useState, useEffect } from 'react';
import BN from 'bn.js'
import { useWeb3 } from '../web3';
import { useMetacoinSale, useMetacoin } from '../web3/contracts';
import { useAccount } from './useAccount'

interface ICOInfo {
  tokenPrice: BN
  balance: string
}

export const useICOInfo = (): Partial<ICOInfo> => {
  const web3 = useWeb3();
  const MetacoinSale = useMetacoinSale();
  const Metacoin = useMetacoin();
  const { account } = useAccount();
  const [info, setInfo] = useState<Partial<ICOInfo>>({});

  useEffect(() => {
    if (!account) return

    (async () => {
      const balance = await Metacoin.methods.balanceOf(account).call();
      const tokenPrice = await MetacoinSale.methods.tokenPrice().call();
      setInfo({ balance, tokenPrice: new BN(tokenPrice) })
    })();
  }, [MetacoinSale, setInfo, web3, account, Metacoin]);

  return info
};
