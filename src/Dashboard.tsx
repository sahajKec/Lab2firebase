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
import "./Dashboard.css";
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
    if (!user || newName === user.name) return;

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
    <div className="dashboard-container">
      {/* Navigation */}
      <nav className="navbar">
        <h1 className="navbar-title">Dashboard</h1>
        <button onClick={handleLogout} className="navbar-logout">
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <div className="content-container">
        {/* Email Verification */}
        <div className="card verification-card">
          {!isEmailVerified ? (
            <div className="verification-message">
              <h2 className="warning-text">Warning!</h2>
              <p className="message-text">
                You need to verify your email address.
              </p>
              <button onClick={handleResendVerification} className="btn-verify">
                Resend Verification Email
              </button>
            </div>
          ) : (
            <div className="welcome-message">
              <h2 className="welcome-text">Hello, {user?.name}!</h2>
              <p className="email-verified-text">Your email is verified.</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card quick-actions-card">
          {isEmailVerified && (
            <>
              <h2 className="quick-actions-title">Quick Actions</h2>

              {/* Message Display */}
              {message && (
                <div
                  className={`message-box ${
                    message.type === "success" ? "success" : "error"
                  }`}
                >
                  {message.text}
                </div>
              )}

              {/* Update Name Button */}
              {!isEditing ? (
                <button
                  onClick={() => {
                    setNewName(user?.name || "");
                    setIsEditing(true);
                  }}
                  className="btn-update-name"
                >
                  Update Name
                </button>
              ) : (
                <div className="name-update-form">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="input-name"
                    placeholder="Enter new name"
                  />
                  <div className="action-buttons">
                    <button onClick={handleUpdateName} className="btn-submit">
                      Submit
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="btn-cancel"
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
