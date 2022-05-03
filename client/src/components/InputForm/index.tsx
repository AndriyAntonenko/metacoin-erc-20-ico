import React from 'react';
import { Form, Input, Message, Button } from 'semantic-ui-react';

import { useBuyTokens } from './hook'

export const InputForm = () => {
  const SemanticForm = Form as any
  const { errorMessage, loading, setAmount, amount, buyTokens } = useBuyTokens();

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await buyTokens();
  };

  const changeAmount = 
    (e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)

  return (
    <SemanticForm onSubmit={submit} error={!!errorMessage}>
      <Form.Field>
        <label>Tokens amount</label>
        <Input 
          value={amount}
          onChange={changeAmount}
          label='tokens'
          labelPosition='right'
          error={!!errorMessage}
        />
      </Form.Field>
      <Message error header="Oops!" content={errorMessage} />
      <Button primary loading={loading}>
        Buy!
      </Button>
    </SemanticForm>
  );
};
