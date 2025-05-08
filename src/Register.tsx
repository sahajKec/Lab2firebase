import { useState, useEffect, ChangeEvent } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  UserCredential,
} from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate, Link } from "react-router-dom";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const Register = () => {
  const db = getFirestore();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [verificationMessage, setVerificationMessage] = useState<string | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userToken = localStorage.getItem("token");
    if (userToken) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleRegister = async () => {
    setErrorMessage(null);
    setVerificationMessage(null);

    try {
      const userCredential: UserCredential =
        await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        name: "user",
        isLoggedIn: false,
        lastLogin: new Date(),
      });
      await updateProfile(user, { displayName: "user" });

      setVerificationMessage(
        "Registration Successful! Check your email to verify your account."
      );

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md shadow-lg rounded-2xl p-8 flex flex-col gap-16 border border-white/30">
        <h2 className="text-center text-4xl font-extrabold">Register</h2>

        <form className="space-y-6 flex flex-col gap-3">
          {errorMessage && (
            <p className="text-center text-md font-medium text-red-400">
              {errorMessage}
            </p>
          )}
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
              className="mt-1 w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
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
              className="mt-1 w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Create a password"
            />
          </div>

          <button
            type="button"
            onClick={handleRegister}
            className="w-full bg-gradient-to-r from-purple-500 to-green-500 hover:opacity-55 hover:text-black hover:cursor-pointer text-white font-semibold py-3 rounded-md transition border-[1px]"
          >
            Sign Up
          </button>

          {verificationMessage && (
            <p className="text-center mt-3 text-md font-medium text-green-400">
              {verificationMessage}
            </p>
          )}
        </form>

        <div className="text-center">
          <Link to="/" className="hover:underline">
            Already have an account?{" "}
            <span className="font-semibold">Sign in here.</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
