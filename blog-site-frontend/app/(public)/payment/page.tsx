import React from "react";
import { subscribePremium } from "../_actions/subscribePremium";

async function Payment() {
  //   await subscribePremium();

  return (
    <div>
      <div className="mx-auto w-fit text-center mt-10">
        <h1 className="text-2xl font-semibold">Go Premium.</h1>
        <p className="text-xl">Subscribe to unlock premium content</p>
      </div>

      <div className="text-center p-5 bg-white w-fit text-black mx-auto">
        <div className="flex justify-between gap-20">
          <div className="">
            <p className="">Premium Plan</p>
          </div>

          <h2 className={`bg-green-600 px-2 rounded-3xl`}>Active</h2>
        </div>
      </div>
    </div>
  );
}

export default Payment;