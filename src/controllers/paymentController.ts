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

const secret = [
  101, 249, 215, 187, 101, 240, 53, 223, 226, 181, 146, 45, 95, 205, 14, 133,
  250, 232, 152, 37, 208, 49, 161, 83, 209, 21, 37, 33, 37, 135, 6, 185, 42, 99,
  95, 132, 174, 210, 215, 86, 60, 253, 82, 161, 204, 162, 139, 94, 47, 218, 173,
  158, 29, 115, 28, 44, 147, 162, 143, 50, 170, 113, 28, 16,
];
const payer = Keypair.fromSecretKey(new Uint8Array(secret));

const myWallet = "AybseJAotUg6vR4xYmsXHbHXEEs1UhtHPN9nYtrQ26W6"; // NOTE: 실제 입급되는 계좌 (받는 계좌)
const recipient = new PublicKey(myWallet);
const endpoint = "http://127.0.0.1:8899";
const connection = new Connection(endpoint, "confirmed");
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

  process: async function (req: Request, res: Response) {
    const url = req.body.url;
    console.log(url);
    const { recipient, amount, reference, label, message, memo } = parseURL(
      url
    ) as TransferRequestURL;
    if (!recipient || !amount || !reference)
      throw new Error("Invalid payment request link");

    const tx = new Transaction();

    if (memo != null) {
      tx.add(
        new TransactionInstruction({
          programId: new PublicKey(
            "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
          ),
          keys: [],
          data: Buffer.from(memo, "utf8"),
        })
      );
    }

    const ix = SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: recipient,
      lamports: amount
        .multipliedBy(LAMPORTS_PER_SOL)
        .integerValue(BigNumber.ROUND_FLOOR)
        .toNumber(),
    });

    if (reference) {
      const ref = Array.isArray(reference) ? reference : [reference];
      for (const pubkey of ref) {
        ix.keys.push({ pubkey, isWritable: false, isSigner: false });
      }
    }
    tx.add(ix);

    const txId = await sendAndConfirmTransaction(connection, tx, [payer]);

    res.status(200).send({
      txId: txId,
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
