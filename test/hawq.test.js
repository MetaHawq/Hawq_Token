const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("test token contract and inheritances", async function () {
	let Token,
		token,
		Stakeable,
		stakeable,
		Airdrop,
		airdrop,
		owner,
		add1,
		add2,
		add3,
		addrs;

	const ONE_WEEK = 604800;
	const ONE_MONTH = 2419200;
	const ONE_DAY = 86400;
	const MORE_THAN_ONE_DAY = 86405;

	// utility method
	const increaseEVMTimeInSeconds = async (seconds, mine = false) => {
		await ethers.provider.send("evm_increaseTime", [seconds]);
		if (mine) {
			await ethers.provider.send("evm_mine", []);
		}
	};

	before(async function () {
		[
			owner,
			add1,
			add2,
			add3,
			add4,
			add5,
			add6,
			add7,
			add8,
			add9,
			add10,
			add11,
			...addrs
		] = await ethers.getSigners();

		Token = await ethers.getContractFactory("HawqToken");
		token = await Token.deploy();
		await token.deployed();

		Stakeable = await ethers.getContractFactory("StakingContract");
		stakeable = await Stakeable.deploy();
		await stakeable.deployed();

		Airdrop = await ethers.getContractFactory("AirdropContract");
		airdrop = await Airdrop.deploy();
		await airdrop.deployed();
	});

	describe("basic tests for Hawq Token", () => {
		it("Should return the correct name and symbol", async function () {
			expect(await token.name()).to.equal("HawqToken");
			expect(await token.symbol()).to.equal("MTT");
		});

		it("test for approve function", async function () {
			//const signers = await ethers.getSigners();
			//const deployerAdd = signers[0];
			//const deployerAdd_ = signers[0].address;
			//const address2 = signers[1].address;
			const aproveAmount = ethers.utils.parseEther("1000000");
			const tx1 = await token
				.connect(owner)
				.approve(add2.address, aproveAmount);
			expect(await token.allowance(owner.address, add2.address)).to.equal(
				aproveAmount
			);
		});
	});

	describe("Testing withraw() method", () => {
		it("Trying to withdraw zero amount", async () => {
			const amount = ethers.utils.parseEther("0");
			await expect(token.connect(add1).withraw(amount)).to.be.revertedWith(
				"stake amount <= 0"
			);
		});
		it("nothing staked, but trying to withdraw", async () => {
			const amount = ethers.utils.parseEther("1");
			await expect(token.connect(add4).withraw(amount)).to.be.revertedWith(
				"stake amount <= 0"
			);
		});
	});

	describe("Testing reward() method", () => {
		it("Trying get reward without staking token", async () => {
			await expect(token.connect(add5).reward()).to.be.revertedWith(
				"no token staked"
			);
		});
	});

	describe("Testing airdrop() method", () => {

		it("airdrop on same day", async () => {
			await expect(
				token.connect(add10).airdrop(add10.address)
			).to.be.revertedWith("invalid drop");
		});

		it("airdrop exceed max-Limit", async () => {
			const prevBal = await token.connect(add11).balanceOf(add11.address);

			for (let i = 1; i <= 150; i++) {
				await increaseEVMTimeInSeconds(ONE_DAY, true);
				await token.connect(add11).airdrop(add11.address);
			}

			const currBal = await token.connect(add11).balanceOf(add11.address);
			expect(currBal).to.equal(prevBal.add(150));

			await increaseEVMTimeInSeconds(ONE_DAY, true);
			await expect(
				token.connect(add11).airdrop(add11.address)
			).to.be.revertedWith("max drops reached");
		});
	});
});