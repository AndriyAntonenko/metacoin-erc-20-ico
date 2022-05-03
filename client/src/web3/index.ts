import Web3 from "web3";

function getSingletonInstance(): () => Web3 {
  let instance: Web3;

  return (): Web3 => {
    if (!instance) {
      window.ethereum.request({ method: "eth_requestAccounts" });
      instance = new Web3(window.ethereum);
    }
    return instance
  };
}

export const useWeb3 = getSingletonInstance();

export const checkWalletIsConnected = (): boolean => {
  return Boolean(window.ethereum);
};
