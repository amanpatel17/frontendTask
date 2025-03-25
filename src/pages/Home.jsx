import { Container, Typography, Card, CardContent, TextField, Select, MenuItem, Pagination, Grid } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Home = () => {
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [user, setUser] = useState(null);
  const itemsPerPage = 2;
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [auth, navigate]);

  const data = [
    { title: " Frontend Developer", description: "Description A" },
    { title: " Backend Developer", description: "Description B" },
    { title: "Full stack Developer ", description: "Description C" },
    { title: "Java Developer  ", description: "Description D" },
    { title: "AI Developer  ", description: "Description E" },
  ];

  const filteredData = data.filter(item => item.title.toLowerCase().includes(search.toLowerCase()));
  const sortedData = [...filteredData].sort((a, b) => sortOrder === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title));
  const paginatedData = sortedData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <Container maxWidth="md" sx={{ mt: 3, px: { xs: 2, md: 4 } }}>
    
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField label="Search" variant="outlined" fullWidth value={search} onChange={e => setSearch(e.target.value)} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Select fullWidth value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </Select>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {paginatedData.map((item, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Card sx={{ p: 2, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6">{item.title}</Typography>
                <Typography variant="body2">{item.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Pagination 
        count={Math.ceil(filteredData.length / itemsPerPage)} 
        page={page} 
        onChange={(e, value) => setPage(value)} 
        sx={{ display: "flex", justifyContent: "center", mt: 5 }}
      />
    </Container>
  );
};

export default Home;
