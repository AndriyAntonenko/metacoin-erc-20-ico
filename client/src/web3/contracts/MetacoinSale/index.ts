import { AbiItem } from 'web3-utils'
import { Contract } from 'web3-eth-contract';
import { useWeb3 } from '../../';
import MetacoinSale from './MetacoinSale.json'

function getSingletonInstance(): () => Contract {
  let instance: Contract

  return (): Contract => {
    if (!instance) {
      const web3 = useWeb3();
      instance = new web3.eth.Contract(
        MetacoinSale.abi as AbiItem[],
        '0xc48DE95Ab430a91b0B48F27ADAA86a285C45105f'
      );
    }

    return instance;
  };
}

export const useMetacoinSale = getSingletonInstance();
