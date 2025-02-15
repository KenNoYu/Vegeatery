import React from "react";
import { Box, Typography, Button, Grid} from "@mui/material";
import { useTheme } from "@mui/material";
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const theme = useTheme();
  const navigate= useNavigate();
  return (
    <Box sx={{ 
      pb: 5,
      width: "100%",
      position: "relative"
      }}>

      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          minHeight: "75vh",
          width: "100%",
          backgroundImage: "url('/assets/homepage/hpHero.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: "white",
          px: 0,
          overflow: "hidden",
          "& .MuiContainer-root": {
            paddingLeft: "0px !important",
            paddingRight: "0px !important",
            marginLeft: "0 !important",
            marginRight: "0 !important",
          },
          zIndex: '100',
        }}
      >
        <Box>
          <Typography variant="h2" fontWeight="bold" textAlign={"left"}>FRESH FLAVOURS, <br />WHOLESOME <br /> CHOICES</Typography>
          <Typography variant="h6" sx={{ mt: 2, background: "rgba(255, 255, 255, .8)" }} color="Accent" textAlign={"left"}>Lentil Bolognese Pasta</Typography>
        </Box>
      </Box>

      {/* Welcome Section */}
      <Box sx={{ px: { xs: 4, md: 16 }, pt: 16, position: "relative", maxWidth: "1200px", margin: "auto" }}>
        {/* Text Content */}
        <Box sx={{ maxWidth: "450px" }}>
          <Typography variant="h3" fontWeight="bold" color="Accent">
            WELCOME TO VEGEATERY
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }} fontSize={20}>
            At Vegeatery, we believe in the power of plants to nourish the body and delight the soul.
            Our menu is crafted with fresh, wholesome ingredients that celebrate the natural flavors of every dish.
            Whether you’re a lifelong veggie lover or just curious about plant-based dining, we’re here to serve
            up meals that are as delicious as they are nutritious. Join us in savoring food that’s good for you and the planet.
          </Typography>
        </Box>

        {/* Circular Image Positioned at Top Right */}
        <Box
          component="img"
          src="/assets/homepage/hpLemonPasta.png"
          alt="Lemon Olive Oil Pasta"
          sx={{
            position: "absolute",
            top: "-50px",
            right: "-20px",
            width: { xs: "300px", md: "400px" },
            height: "auto",
          }}
        />
      </Box>

      {/* Menu Preview */}
      <Box sx={{ px: { xs: 2, md: 8 }}}>

        <Grid container spacing={0} alignItems="center" sx={{ mt: 3 }}>
          {/* Taco Image */}
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="/assets/homepage/hpTacos.png"
              alt="Vegan Portobello Tacos"
              sx={{
                width: "100%",
                maxWidth: "400px",
                borderRadius: 2,
                display: "block",
                margin: "auto"
              }}
            />
          </Grid>

          {/* Taco Description */}
          <Grid item xs={12} md={6} sx={{mt: -20, pl: { md: 12 }}}>

            <Typography variant="h3"  color="Accent">
              DISCOVER <br/> OUR MENU
            </Typography>
            <Box sx={{mt: 7}}>
              <Typography variant="h6" fontWeight="bold">
                TACOS
              </Typography>
              <Typography variant="body1" sx={{ mt: 1, maxWidth: "400px" }} fontSize={20}>
                Savor the smoky, marinated portobello mushrooms in our Vegan Portobello Tacos,
                paired with guacamole, zesty pickled onions, and a hint of spice, all in a soft corn tortilla.
              </Typography>
              <Button
                variant="outlined"
                sx={{
                  mt: 2,
                  borderWidth: 1,
                  width: "50%",
                  textTransform: "none",
                  color: theme.palette.Accent.main, 
                  borderColor: theme.palette.Accent.main, 
                  backgroundColor: "transparent", 
                  "&:hover": {
                    backgroundColor: "#E7ABC5", 
                  },
                }}
                onClick={() => navigate("/user/store")}
              >
                Explore
              </Button>
            </Box>
          </Grid>

          {/* Juice Description */}
          <Grid item xs={12} md={6} sx={{ textAlign: "right", pr: { md: 6 }, mt: 10 }}>
            <Box sx={{ display: "inline-block", textAlign: "left" }}>
              <Typography variant="h6" fontWeight="bold">
                SIGNATURE JUICE
              </Typography>
              <Typography variant="body1" sx={{ mt: 1, maxWidth: "400px" }} fontSize={20}>
                Ginger-Beet Juice: A vibrant blend of earthy beets, zesty ginger, and a splash of citrus for a refreshing
                and energizing drink that’s as good for your body as it is for your taste buds.
              </Typography>
            </Box>
          </Grid>

          {/* Juice Image */}
          <Grid item xs={12} md={6} mt={10}>
            <Box
              component="img"
              src="/assets/homepage/hpJuice.png"
              alt="Ginger-Beet Juice"
              sx={{
                width: "100%",
                maxWidth: "400px",
                borderRadius: 2,
                display: "block",
                margin: "auto"
              }}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Quote Section */}
      <Box
      sx={{
        position: "relative",
        backgroundColor: "#E3F2FD",
        py: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Quote Text */}
      <Typography
        variant="h4"
        fontWeight="bold"
        fontStyle="italic"
        sx={{
          textAlign: "center",
          color: "#6F1C11",
          mb: 4,
          zIndex: 2,
        }}
      >
        <span style={{ color: "#D48806" }}>“</span> THE GRASS IS <br/>GREENER HERE{" "}
        <span style={{ color: "#D48806" }}>”</span>
      </Typography>

      {/* Directly Display the SVG */}
      <Box
        component="img"
        src="/assets/homepage/GrassMask.svg"
        alt="Masked Quote Section"
        sx={{
          width: "80%",
          maxWidth: "900px",
        }}
      />
      <Button variant="contained"
      sx={{
        mt: 7,
        borderWidth: 1,
        width: "20%",
        textTransform: "none",
        color: theme.palette.primary.main, 
        borderColor: "none", 
        backgroundColor: theme.palette.Accent.main, 
        "&:hover": {
          backgroundColor: "#E7ABC5", 
        },
      }}
      onClick={() => navigate("/reserve")}>
        Reserve A Table
      </Button>
    </Box>

      {/* Membership Section */}
      <Box sx={{ px: 4, py: 6, maxWidth: "1200px", margin: "auto" }}>
        <Typography variant="h4" fontWeight="bold" color="#C2185B">GAIN MEMBERSHIP POINTS</Typography>
        <Grid container spacing={3} sx={{ mt: 3 }}>
          {[
            { level: "Bronze Member", points: "0 - 277", color: "#E0E0E0" },
            { level: "Silver Member", points: "278 - 777", color: "#A5D6A7" },
            { level: "Gold Member", points: "777+", color: "#212121", textColor: "white" }
          ].map((tier, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Box
                sx={{
                  backgroundColor: tier.color,
                  color: tier.textColor || "black",
                  borderRadius: 3,
                  p: 3,
                  textAlign: "center",
                  height: "100%"
                }}
              >
                <Typography variant="h6" fontWeight="bold">{tier.level}</Typography>
                <Typography variant="body1">{tier.points}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Button variant="outlined" color="Accent" sx={{ px: 4, py: 1.5, borderRadius: 3 }}>
            Become a Vegeaterian
          </Button>
        </Box>
      </Box>

    </Box>
  );
};

export default Home;
