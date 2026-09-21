import React from "react";
import LoginForm from "../_components/loginForm";


function LoginPage() {
  return (
    <>
      

      <div className="flex min-h-screen justify-center items-center">
        <div className="border-2 rounded-2xl p-8 shadow-lg/30 shadow-gray-300">
          {/*form related texts*/}
          <div className="w-fit mx-auto">
            <h1 className="text-center text-4xl">Welcome back</h1>
            <p className="text-center text-2xl text-gray-400">
              Enter your credentials and login
            </p>
          </div>
          {/* form */}
          <LoginForm />
        </div>
      </div>
    </>
  );
}

export default LoginPage;
