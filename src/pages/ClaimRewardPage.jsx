import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ClaimRewardPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [message, setMessage] = useState("Processing your reward...");
  const [claiming, setClaiming] = useState(true);

  const query = new URLSearchParams(location.search);
  const binId = query.get("binId");

  const didRun = useRef(false); // 🔥 prevents double execution

  useEffect(() => {
    // 🔥 StrictMode fix — run once only
    if (didRun.current) return;
    didRun.current = true;

    // 1️⃣ Wait for auth
    if (loading) return;

    // 2️⃣ Invalid QR
    if (!binId) {
      setMessage("Invalid QR code.");
      setClaiming(false);
      return;
    }

    // 3️⃣ Not logged in → login
    if (!user) {
      navigate("/login");
      return;
    }

    // 4️⃣ Claim reward
    const claimReward = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/bin/claim", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user._id,
            binId,
          }),
        });

        const data = await res.json();

        if (!data.success) {
          setMessage(data.message || "Unable to claim reward.");
          setClaiming(false);
          return;
        }

        setMessage(`Success! You earned ${data.reward} points!`);

        setTimeout(() => {
          navigate("/history");
        }, 1500);

      } catch (err) {
        setMessage("Server error. Please try again.");
      } finally {
        setClaiming(false);
      }
    };

    claimReward();
  }, [loading, user, binId, navigate]);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Reward Claim</h2>
      <p>{message}</p>
      {claiming && <p>Please wait...</p>}
    </div>
  );
}
