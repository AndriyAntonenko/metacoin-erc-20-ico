import { Header, Container } from 'semantic-ui-react';
import { useICOInfo } from '../../hooks';
import { useWeb3 } from '../../web3';

export const Greetings = () => {
  const SemanticHeader = Header as any
  const { tokenPrice, balance } = useICOInfo();
  const web3 = useWeb3();

  const price = tokenPrice ? web3.utils.fromWei(tokenPrice) : 0;
  return (
    <Container text>
      <SemanticHeader as='h1' textAlign='center' >
        METACOIN TOKEN ICO SALE
        <Header.Subheader>
          Introducing "Metacoin" (MTC)!
          Token price {price} is Ether. You currently have {balance} MTC.
        </Header.Subheader>
      </SemanticHeader>
    </Container>
  );
};
