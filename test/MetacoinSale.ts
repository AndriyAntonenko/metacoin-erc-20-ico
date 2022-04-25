import { metacoinConfig } from "../config"
import { MetacoinSaleInstance, MetacoinInstance } from '../types/truffle-contracts';

const Metacoin = artifacts.require("Metacoin");
const MetacoinSale = artifacts.require("MetacoinSale");

contract("MetacoinSale", (accounts: string[]) => {
  const admin = accounts[0];
  const buyer = accounts[1];
  let tokenSaleInstance: MetacoinSaleInstance;
  let tokenInstance: MetacoinInstance;

  before(async () => {
    tokenInstance = await Metacoin.deployed();
    tokenSaleInstance = await MetacoinSale.deployed();
    // sale 75% of available tokens
    await tokenInstance.transfer(tokenSaleInstance.address, metacoinConfig.amountToSale, { from: admin });
  });

  it("initialize the contract with the tokenContract address", async () => {
    const tokenContractAddress = await tokenSaleInstance.tokenContract();
    assert.notEqual(tokenContractAddress, 0x0.toString());
  });

  it("sets token price correctly", async () => {
    const tokenPrice = await tokenSaleInstance.tokenPrice();
    assert.equal(tokenPrice.toNumber(), metacoinConfig.price);
  });

  it("does not allow underpaying for tokens", async () => {
    try {
      await tokenSaleInstance.buyTokens(10, { from: buyer, value: "1" }); // trying to pay 1 wei
      assert.ok(false);
    } catch (_) {
      assert.ok(true);
    }
  });

  it("does not allow overpaying for tokens", async () => {
    try {
      const amount = 10;
      const value = (2 * amount * metacoinConfig.price).toString();
      await tokenSaleInstance.buyTokens(amount, { from: buyer, value })
      assert.ok(false);
    } catch (_) {
      assert.ok(true);
    }
  });

  it("cannot sale more tokens than available", async () => {
    try {
      const amount = metacoinConfig.amountToSale + 1;
      const value = (amount * metacoinConfig.price).toString();
      await tokenSaleInstance.buyTokens(amount, { from: buyer, value });
      assert.ok(false);
    } catch (_) {
      assert.ok(true);
    }
  });

  it("facilitates token buying", async () => {
    const amount = 10;
    const value = (amount * metacoinConfig.price).toString();

    const txResponse = await tokenSaleInstance.buyTokens(amount, { from: buyer, value });
    const tokensSold = await tokenSaleInstance.tokenSold();

    const saleContractBalance = await tokenInstance.balanceOf(tokenSaleInstance.address);
    const buyerBalance = await tokenInstance.balanceOf(buyer);

    assert.equal(tokensSold.toNumber(), amount);
    assert.equal(saleContractBalance.toNumber(), metacoinConfig.amountToSale - amount);
    assert.equal(buyerBalance.toNumber(), amount);

    assert.equal(txResponse.logs.length, 1);
    assert.equal(txResponse.logs[0].event, 'Sell');
    assert.equal(txResponse.logs[0].args._buyer, buyer);
    assert.equal(txResponse.logs[0].args._amount.toNumber(), amount);
  });


  it("cannot ends token sale, from account other than admin", async () => {
    try {
      await tokenSaleInstance.endSale({ from: buyer });
      assert.ok(false);
    } catch (_) {
      assert.ok(true);
    }
  });

  it("ends token sale after request from admin account", async () => {
    const tokensRemains = await tokenInstance.balanceOf(tokenSaleInstance.address);
    const adminBalance = await tokenInstance.balanceOf(admin);
    await tokenSaleInstance.endSale({ from: admin });

    const updatedAdminBalance = await tokenInstance.balanceOf(admin);
    assert.equal(updatedAdminBalance.toNumber(), adminBalance.add(tokensRemains).toNumber());

    try {
      await tokenSaleInstance.tokenPrice();
      assert.ok(false);
    } catch (_) {
      assert.ok(true);
    }
  });
});
