import { Label, Icon } from 'semantic-ui-react'
import { useAccount } from '../hooks'

export const Account = () => {
  const { account } = useAccount();
  
  return (
    <Label as="a" size="large">
      <Icon name="address book" />
      Current address:
      <Label.Detail>{account}</Label.Detail>
    </Label>
  );
};
