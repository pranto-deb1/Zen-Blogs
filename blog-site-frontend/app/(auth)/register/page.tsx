import React from "react";
import RegisterForm from "../_components/registerForm";

function page() {
  return (
    <div className="flex min-h-screen justify-center items-center">
      <div className="border-2 rounded-2xl p-8 shadow-lg/30 shadow-gray-300">
        {/*form related texts*/}
        <div className="w-fit mx-auto">
          <h1 className="text-center text-4xl">Welcome</h1>
          <p className="text-center text-2xl text-gray-400">
            Enter your credentials and Create an account
          </p>
        </div>
        {/* form */}
        <RegisterForm />
      </div>
    </div>
  );
}

export default page;
