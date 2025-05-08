import { useState, useEffect, ChangeEvent } from "react";
import { auth } from "./firebase";
import { signInWithEmailAndPassword, UserCredential } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error" | "";
  }>({ text: "", type: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const userToken = localStorage.getItem("token");
    if (userToken) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async () => {
    setMessage({ text: "", type: "" });
    try {
      const data: UserCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userToken: string = await data.user.getIdToken();
      if (userToken) {
        localStorage.setItem("token", userToken);
        setMessage({
          text: "Login Successful! Redirecting...",
          type: "success",
        });
        setTimeout(() => navigate("/dashboard"), 1000);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage({ text: error.message, type: "error" });
      } else {
        setMessage({ text: "An unexpected error occurred.", type: "error" });
      }
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md shadow-lg rounded-3xl p-8 flex flex-col gap-20 border border-white/30">
        <h2 className="text-center text-4xl font-extrabold">Sign In</h2>

        <form className="space-y-6 flex flex-col gap-3">
          <div>
            <label htmlFor="email" className="block font-medium">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              className="mt-1 w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              className="mt-1 w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="button"
            onClick={handleLogin}
            className="w-full hover:bg-purple-900 bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-55 hover:text-black hover:cursor-pointer text-white font-semibold py-3 rounded-md transition border-[1px]"
          >
            Sign In
          </button>

          {message.text && (
            <p
              className={`text-center mt-3 text-md font-medium ${
                message.type === "success" ? "text-green-400" : "text-red-400"
              }`}
            >
              {message.text}
            </p>
          )}
        </form>

        <div className="text-center">
          <Link to="/register" className="hover:underline">
            Not registered yet?{" "}
            <span className="font-semibold">Register here.</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
