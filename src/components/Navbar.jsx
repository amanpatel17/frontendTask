import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, useMediaQuery, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openLogoutModal, setOpenLogoutModal] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  const isMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        setSnackbarMessage("Welcome, " + user.email);
        setOpenSnackbar(true);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  const handleLogout = async () => {
    await signOut(auth);
    setSnackbarMessage("You have been logged out.");
    setOpenSnackbar(true);
    setOpenLogoutModal(false);
    navigate("/login");
  };

  return (
    <>
      <AppBar position="static"  sx={{background: 'linear-gradient(45deg, #1A2980 30%,rgb(38, 126, 208) 90%)', color: 'white' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, cursor: "pointer" }} onClick={() => navigate("/")}> 
            Frontend Task   
          </Typography>

          {isMobile ? (
            <>
              <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
                <MenuIcon />
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                {user ? (
                  <>
                    <MenuItem>{user.email}</MenuItem>
                    <MenuItem onClick={() => setOpenLogoutModal(true)}>Logout</MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem onClick={() => navigate("/login")}>Login</MenuItem>
                    <MenuItem onClick={() => navigate("/signup")}>Signup</MenuItem>
                  </>
                )}
              </Menu>
            </>
          ) : (
            <>
              {user && (
                <Typography variant="body1" sx={{ marginRight: 2 }}>
                  {user.email}
                </Typography>
              )}
              {user ? (
                <Button color="inherit" onClick={() => setOpenLogoutModal(true)}>
                  Logout
                </Button>
              ) : (
                <>
                  <Button color="inherit" onClick={() => navigate("/login")}>Login</Button>
                  <Button color="inherit" onClick={() => navigate("/signup")}>Signup</Button>
                </>
              )}
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Logout Confirmation Modal */}
      <Dialog open={openLogoutModal} onClose={() => setOpenLogoutModal(false)}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          Are you sure you want to log out?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLogoutModal(false)} color="primary">Cancel</Button>
          <Button onClick={handleLogout} color="secondary">Logout</Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar 
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
      />
    </>
  );
};

export default Navbar;
