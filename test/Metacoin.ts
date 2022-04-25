import { metacoinConfig } from "../config";
import { MetacoinInstance } from '../types/truffle-contracts';

const Metacoin = artifacts.require("Metacoin");
contract('Metacoin', (accounts: string[]) => {
  let tokenInstance: MetacoinInstance

  before(async () => {
    tokenInstance = await Metacoin.deployed();
  })
  
  it('sets the total supply upon deployment', async () => {
    const totalSupply = await tokenInstance.totalSupply();
    assert.equal(totalSupply.toNumber(), metacoinConfig.totalSupply, 'sets the total supply to 1,000,000');
  });

  it('sets total supply to contract creator address', async () => {
    const creatorBalance = await tokenInstance.balanceOf(accounts[0]);
    assert.equal(creatorBalance.toNumber(), metacoinConfig.totalSupply);
  });

  it('transfer throws, if sender have no enough balance', async () => {
    try {
      await tokenInstance.transfer.call(accounts[1], metacoinConfig.totalSupply + 1, { from: accounts[0] });
      assert.ok(false);
    } catch (error) {
      assert.ok(true)
    }
  });

  it('transfers money to another account', async () => {
    const value = 250;
    const [balanceOfReceiverBeforeTx, balanceOfSenderBeforeTx] = await Promise.all([
      tokenInstance.balanceOf(accounts[1]),
      tokenInstance.balanceOf(accounts[0])
    ])

    const success = await tokenInstance.transfer.call(accounts[1], value, { from: accounts[0] });
    const txResponse = await tokenInstance.transfer(accounts[1], value, { from: accounts[0] });
    const [balanceOfReceiverAfterTx, balanceOfSenderAfterTx] = await Promise.all([
      tokenInstance.balanceOf(accounts[1]),
      tokenInstance.balanceOf(accounts[0])
    ])

    assert.ok(success);
    assert.equal(txResponse.logs.length, 1);
    assert.equal(txResponse.logs[0].event, 'Transfer');
    assert.equal(txResponse.logs[0].args[0], accounts[0]);
    assert.equal(txResponse.logs[0].args[1], accounts[1]);
    assert.equal(txResponse.logs[0].args[2].toNumber(), value);
    assert.equal(balanceOfReceiverAfterTx.toNumber(), balanceOfReceiverBeforeTx.toNumber() + value);
    assert.equal(balanceOfSenderAfterTx.toNumber(), balanceOfSenderBeforeTx.toNumber() - value);
  });

  it('approves tokens for delegate transfers', async () => {
    const value = 100;
    const success = await tokenInstance.approve.call(accounts[1], value, { from: accounts[0] });
    const txResponse = await tokenInstance.approve(accounts[1], value, { from: accounts[0] });

    const allowed = await tokenInstance.allowance(accounts[0], accounts[1]);

    assert.ok(success);
    assert.equal(txResponse.logs.length, 1);
    assert.equal(txResponse.logs[0].event, 'Approval');
    assert.equal(txResponse.logs[0].args[0], accounts[0]);
    assert.equal(txResponse.logs[0].args[1], accounts[1]);
    assert.equal(txResponse.logs[0].args[2].toNumber(), value);
    assert.equal(allowed.toNumber(), value);
  });

  it('transferFrom throws, when _from account have not enough balance', async () => {
    const fromAccount = accounts[2];
    const toAccount = accounts[3];
    const spendingAccount = accounts[4];

    await tokenInstance.transfer(fromAccount, 100, { from: accounts[0] });
    // approve spendingAccount to spend 10 tokens from fromAccount
    await tokenInstance.approve(spendingAccount, 10, { from: fromAccount });
    try {
      await tokenInstance.transferFrom(fromAccount, toAccount, 101, { from: spendingAccount });
      assert.ok(false);      
    } catch (error) {
      assert.ok(true);
    }

  });

  it('transferFrom throws, when trying to send more tokens than were allowed', async () => {
    const fromAccount = accounts[2];
    const toAccount = accounts[3];
    const spendingAccount = accounts[4];

    try {
      await tokenInstance.transferFrom(fromAccount, toAccount, 11, { from: spendingAccount });
      assert.ok(false);      
    } catch (error) {
      assert.ok(true);
    }
  });

  it('handles delegate transfer correctly', async () => {
    const amount = 9;
    const fromAccount = accounts[2];
    const toAccount = accounts[3];
    const spendingAccount = accounts[4];
    const [fromAccountBalanceBefore, toAccountBalanceBefore, allowance] = await Promise.all([
      tokenInstance.balanceOf(fromAccount),
      tokenInstance.balanceOf(toAccount),
      tokenInstance.allowance(fromAccount, spendingAccount)
    ]);

    const success = await tokenInstance.transferFrom.call(fromAccount, toAccount, amount, { from: spendingAccount });
    const txResponse = await tokenInstance.transferFrom(fromAccount, toAccount, amount, { from: spendingAccount });

    const [fromAccountBalanceAfter, toAccountBalanceAfter, remainedAllowance] = await Promise.all([
      tokenInstance.balanceOf(fromAccount),
      tokenInstance.balanceOf(toAccount),
      tokenInstance.allowance(fromAccount, spendingAccount)
    ])

    assert.ok(success);
    assert.equal(txResponse.logs.length, 1);
    assert.equal(txResponse.logs[0].event, 'Transfer');
    assert.equal(txResponse.logs[0].args[0], fromAccount);
    assert.equal(txResponse.logs[0].args[1], toAccount);
    assert.equal(txResponse.logs[0].args[2].toNumber(), amount);

    assert.equal(fromAccountBalanceAfter.toNumber(), fromAccountBalanceBefore.toNumber() - amount);
    assert.equal(toAccountBalanceAfter.toNumber(), toAccountBalanceBefore.toNumber() + amount);
    assert.equal(remainedAllowance.toNumber(), allowance.toNumber() - amount);
  });
});

