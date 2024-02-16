"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useId, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { FormProvider, useForm } from "react-hook-form";
import { FaucetSchema } from "./schema";

const PAYOUT_INTERVAL = process.env.PAYOUT_INTERVAL;

export function FaucetClient({
  faucet,
}: {
  faucet: {
    balance: number;
    address: string;
    transactions: any[];
  };
}) {
  const form = useForm({
    resolver: zodResolver(FaucetSchema),
  });

  const address = form.watch("address");
  const addressId = useId();

  const [transactions, setTransactions] = useState<unknown[]>([]);
  const [errorResponse, setErrorResponse] = useState<string | undefined>();
  const recaptchaRef = useRef();

  function handleCopy(txid: string) {
    navigator.clipboard.writeText(txid);
    alert("Copied Transaction ID: " + txid);
  }

  const onReCAPTCHAChange = async (captcha: any) => {
    try {
      setErrorResponse(undefined);
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address,
          captcha,
        }),
      });
      if (response.ok) {
        const result = await response.json();
        setTransactions((prev) => [...prev, result]);
      } else {
        const error = await response.json();
        setErrorResponse((error as Error).message);
      }
    } catch (error) {
      setErrorResponse((error as Error).message);
    } finally {
      // Reset the reCAPTCHA when the request has failed or succeeeded
      // so that it can be executed again if user submits another email.
      // @ts-ignore
      window.grecaptcha.reset();
    }
  };

  async function handleSubmit() {
    if (recaptchaRef?.current) {
      // @ts-ignore
      await recaptchaRef.current.executeAsync();
    }
  }

  return (
    <FormProvider {...form}>
      <div className="flex flex-col items-center justify-center w-full h-full max-w-lg px-4 mx-auto">
        <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full">
          <ReCAPTCHA
            // @ts-ignore
            ref={recaptchaRef}
            size="invisible"
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
            onChange={onReCAPTCHAChange}
          />
          <div className="flex flex-col items-center gap-1 mb-8">
            <Image
              src="/logo.svg"
              width="100"
              height="100"
              alt="Logo"
              className="mb-4"
            />
            <h1 className="text-2xl font-medium">
              Claim Free {process.env.NEXT_PUBLIC_BLOCKCHAIN_NAME!}
            </h1>
            <p className="text-sm">
              Earn free <b>TESTNET</b>{" "}
              {process.env.NEXT_PUBLIC_BLOCKCHAIN_NAME!.toLowerCase()} every{" "}
              {Number(PAYOUT_INTERVAL) / 60 / 1000} hours
            </p>
            <div className="text-sm">Faucet Balance: {faucet.balance}</div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor={addressId} className="text-sm">
              Testnet Address
            </label>
            <div className="flex flex-row divide-x">
              <input
                {...form.register("address")}
                className="flex-1 block p-3 text-sm border border-r-0 rounded-sm rounded-l border-gray"
                id={addressId}
                placeholder="Enter your address..."
                name="address"
                disabled={form.formState.isSubmitting}
              />
              <button
                type="submit"
                className="border border-transparent bg-[#BC8312] text-white px-3 rounded-r hover:bg-[#77530b] active:bg-[#77530b] focus:bg-[#77530b] ease duration-300"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <svg
                    className="w-5 h-5 mx-4 text-white animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  "Submit"
                )}
              </button>
            </div>

            {form.formState?.errors?.address?.message ? (
              <div className="text-sm text-red-500">
                {form.formState.errors.address.message as string}
              </div>
            ) : undefined}
          </div>
        </form>
        {!!errorResponse ? (
          <div className="w-full p-2 my-4 text-sm text-red-700 bg-red-100 border border-red-200 rounded">
            {errorResponse}
          </div>
        ) : undefined}
        {transactions.slice(-3).map((tx: any) => (
          <div
            key={tx.id}
            className="flex items-center justify-between w-full gap-1 p-2 mt-2 text-sm bg-blue-100 border border-blue-200 rounded"
          >
            <span>
              <span>Transaction ID:</span>{" "}
              {`${tx.transactionId.substring(
                0,
                10
              )}...${tx.transactionId.substring(
                tx.transactionId.length - 10,
                tx.transactionId.length
              )}`}
            </span>
            <button type="button" onClick={() => handleCopy(tx.transactionId)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20px"
                height="20px"
                viewBox="0 0 1024 1024"
              >
                <path
                  fill="#000000"
                  d="M768 832a128 128 0 0 1-128 128H192A128 128 0 0 1 64 832V384a128 128 0 0 1 128-128v64a64 64 0 0 0-64 64v448a64 64 0 0 0 64 64h448a64 64 0 0 0 64-64h64z"
                />
                <path
                  fill="#000000"
                  d="M384 128a64 64 0 0 0-64 64v448a64 64 0 0 0 64 64h448a64 64 0 0 0 64-64V192a64 64 0 0 0-64-64H384zm0-64h448a128 128 0 0 1 128 128v448a128 128 0 0 1-128 128H384a128 128 0 0 1-128-128V192A128 128 0 0 1 384 64z"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </FormProvider>
  );
}
