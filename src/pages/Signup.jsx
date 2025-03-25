import { Container, TextField, Button, Typography, Box } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Google as GoogleIcon } from "@mui/icons-material";
import { toast } from "react-toastify";
import { getAuth, signInWithPopup, createUserWithEmailAndPassword, GoogleAuthProvider } from "firebase/auth";
import { app } from "../firebase"; // Ensure you have Firebase initialized

const Signup = ({ login }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      login(email);
      toast.success("Signup successful!");
      navigate("/"); // Redirect to Home Page
    } catch (error) {
      toast.error("Signup failed: " + error.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      login(result.user.email);
      toast.success("Signed up with Google!");
      navigate("/");
    } catch (error) {
      toast.error("Google signup failed");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <Box sx={{ p: 3, borderRadius: 2, boxShadow: 3, backgroundColor: "white", width: "100%" }}>
        <Typography variant="h5" textAlign="center" gutterBottom>Signup</Typography>
        <TextField fullWidth label="Email" variant="outlined" margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField fullWidth label="Password" type="password" variant="outlined" margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button fullWidth variant="contained" color="primary" onClick={handleSignup} sx={{ mt: 2 }}>
          Signup
        </Button>
        <Button fullWidth variant="outlined" color="secondary" startIcon={<GoogleIcon />} onClick={handleGoogleSignup} sx={{ mt: 2 }}>
          Signup with Google
        </Button>
      </Box>
    </Container>
  );
};

export default Signup;