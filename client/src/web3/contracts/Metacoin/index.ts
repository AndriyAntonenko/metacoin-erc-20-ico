import { AbiItem } from 'web3-utils'
import { Contract } from 'web3-eth-contract';
import { useWeb3 } from '../../';
import Metacoin from './Metacoin.json'

function getSingletonInstance(): () => Contract {
  let instance: Contract

  return (): Contract => {
    if (!instance) {
      const web3 = useWeb3();
      instance = new web3.eth.Contract(
        Metacoin.abi as AbiItem[],
        '0xC41DF85790d65F292A29AE48E1f5565326A704F4'
      );
    }

    return instance;
  };
}

export const useMetacoin = getSingletonInstance();
