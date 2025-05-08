import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendEmailVerification } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  signOut,
  updateProfile,
  User,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "./firebase";

const db = getFirestore();

interface UserData {
  uid: string;
  email: string;
  name: string;
}

interface Message {
  type: "success" | "error";
  text: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<Message | null>(null);
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setIsEmailVerified(currentUser.emailVerified);

        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));

          if (userDoc.exists()) {
            setUser(userDoc.data() as UserData);
          } else {
            const newUser: UserData = {
              uid: currentUser.uid,
              email: currentUser.email ?? "",
              name: "User",
            };

            await setDoc(doc(db, "users", currentUser.uid), newUser);
            setUser(newUser);
          }
        } catch (error) {
          console.error("Error fetching user document:", error);
        }
      } else {
        navigate("/");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleUpdateName = async () => {
    if (!user) return;

    try {
      await updateProfile(auth.currentUser as User, { displayName: newName });
      await updateDoc(doc(db, "users", user.uid), { name: newName });

      setUser((prevUser) => (prevUser ? { ...prevUser, name: newName } : null));
      setIsEditing(false);
      setMessage({ type: "success", text: "Your name was changed." });
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ type: "error", text: "Failed to update name." });
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleResendVerification = async () => {
    if (auth.currentUser) {
      try {
        await sendEmailVerification(auth.currentUser);
        setMessage({ type: "success", text: "Verification email sent." });
      } catch (error) {
        console.error("Error sending verification email:", error);
        setMessage({
          type: "error",
          text: "Failed to resend verification email.",
        });
      }
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold text-gray-600">
        <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold"></h1>
        <button
          onClick={handleLogout}
          className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-red-600 hover:cursor-pointer"
        >
          Logout
        </button>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-1 gap-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          {!isEmailVerified ? (
            <div>
              <h2 className="text-yellow-600 mb-2 text-lg">Warning!</h2>
              <p className="text-gray-600 text-lg mb-10">
                You need to verify your email.
              </p>
              <button
                onClick={handleResendVerification}
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-orange-600 hover:cursor-pointer ml-35"
              >
                Resend Verification Email
              </button>
            </div>
          ) : (
            <div className="flex">
              <h2 className="text-3xl font-semibold">Hello {user?.name}.</h2>
            </div>
          )}
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-center">
          {isEmailVerified && (
            <>
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              {message && (
                <div
                  className={`p-2 rounded text-lg mb-4 ${
                    message.type === "success"
                      ? "text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {message.text}
                </div>
              )}
              {!isEditing ? (
                <button
                  onClick={() => {
                    setNewName(user?.name || "");
                    setIsEditing(true);
                  }}
                  className="bg-green-500 w-70 text-white px-4 py-2 rounded hover:bg-red-800 hover:cursor-pointer"
                >
                  Update Name
                </button>
              ) : (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter new name"
                  />
                  <div className="flex space-x-2 justify-center">
                    <button
                      onClick={handleUpdateName}
                      className="bg-green-500 text-white px-8 py-2 rounded hover:bg-green-600 hover:cursor-pointer"
                    >
                      Submit
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-500 text-white px-8 py-2 rounded hover:bg-gray-600 hover:cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
