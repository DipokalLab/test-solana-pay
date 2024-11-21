import { Request, Response, NextFunction } from "express";
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  encodeURL,
  validateTransfer,
  parseURL,
  TransferRequestURL,
  findReference,
} from "@solana/pay";
import BigNumber from "bignumber.js";

const myWallet = "DemoKMZWkk483hX4mUrcJoo3zVvsKhm8XXs28TuwZw9H"; // NOTE: 실제 입급되는 계좌 (받는 계좌)
const recipient = new PublicKey(myWallet);
const quickNodeEndpoint =
  "https://warmhearted-fragrant-silence.solana-devnet.quiknode.pro/b9f8093e29be5af0b861096113d2c23c756e840a";
const connection = new Connection(quickNodeEndpoint, "confirmed");
const amount = new BigNumber(0.1);
const reference = new Keypair().publicKey;
const label = "QuickNode Guide Store";
const message = `QuickNode Demo - Order ID #0${
  Math.floor(Math.random() * 999999) + 1
}`;
const memo = "QN Solana Pay Demo Public Memo";

const paymentController = {
  create: async function (req: Request, res: Response) {
    const url: URL = encodeURL({
      recipient: recipient,
      amount: amount,
      reference: reference,
      label: label,
      message: message,
      memo: memo,
    });

    res.status(200).send({
      url: url,
    });
  },

  verify: async function (req: Request, res: Response) {
    const found = await findReference(connection, reference);

    const response = await validateTransfer(
      connection,
      found.signature,
      {
        recipient: recipient,
        amount: amount,
        splToken: undefined,
        reference: reference,
        memo: memo,
      },
      { commitment: "confirmed" }
    );

    res.status(200).send({
      response: response,
    });
  },
};

export { paymentController };
