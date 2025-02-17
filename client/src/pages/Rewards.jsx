import React from "react";
import { Box, Typography, Card, CardContent, Button, Grid, Container } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import DiscountIcon from "@mui/icons-material/Discount";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Rewards = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box sx={{ 
      pb: 5, 
      width: "100%", 
      position: "relative", 
      margin: 0, 
      padding: 0,
      display: "flex", // Flexbox to center content
      flexDirection: "column", // Stack the content vertically
      justifyContent: "flex-start", // Align content to the top
      alignItems: "center", // Center content horizontally
      minHeight: "100vh", // Ensure it takes up the full height of the viewport
    }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          minHeight: "75vh",
          width: "100vw", // Ensure full width
          backgroundImage: "url('/assets/rewards/vegetarian-food-singapore-best-restaurants.png')",
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
          zIndex: -1,
          margin: 0, // Remove any margin around the container
          "::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.6)", // Dark overlay
            zIndex: -1,
          },
        }}
      >
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Typography variant="h2" fontWeight="bold" textAlign="left">
            REWARDING EVERY VISIT
          </Typography>
          <Typography
            variant="h6"
            sx={{ mt: 2, background: "rgba(255, 255, 255, 0.8)", p: 1, borderRadius: 1 }}
            color="text.primary"
            textAlign="left"
          >
            Earn points and exclusive perks!
          </Typography>
        </Box>
      </Box>

      {/* Rewards Overview Section */}
      <Container disableGutters sx={{ pt: 16, maxWidth: "1200px", margin: "auto" }}>
        <Typography variant="h3" fontWeight="bold" color="Accent">
          JOIN THE VEGEATERY FAMILY
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }} fontSize={20}>
          Enjoy exclusive discounts when dining with us. Sign up today and start earning points on every order!
        </Typography>
      </Container>

      {/* Rewards Benefits */}
      <Container disableGutters sx={{ mt: 10 }}>
        <Grid container spacing={4} justifyContent="center">
          {[
            { 
              icon: <StarIcon fontSize="large" />, 
              title: "Earn Rewards", 
              description: "Collect points with every meal and unlock exclusive bonus rewards!" 
            },
            { 
              icon: <CardGiftcardIcon fontSize="large" />, 
              title: "Level Up Your Tier", 
              description: "Climb the ranks and enjoy greater perks as you move up the tiers!" 
            },
            { 
              icon: <DiscountIcon fontSize="large" />, 
              title: "Redeem Discounts", 
              description: "Enjoy special discounts tailored to your membership tier!" 
            }
          ].map((reward, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ textAlign: "center", p: 3, borderRadius: 3, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                <CardContent>
                  <Box sx={{ color: "#C6487E ", mb: 2 }}>{reward.icon}</Box>
                  <Typography variant="h6" fontWeight="bold">
                    {reward.title}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>{reward.description}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Membership Tiers */}
      <Container disableGutters sx={{ py: 6, maxWidth: "1200px", margin: "auto", mt: 10 }}>
        <Typography variant="h4" fontWeight="bold" color="#C2185B">
          REWARD TIERS
        </Typography>
        <Grid container spacing={3} sx={{ mt: 3 }}>
          {[
            { level: "Bronze", points: "0 - 277", color: "#E0E0E0" },
            { level: "Silver", points: "278 - 777", color: "#A5D6A7" },
            { level: "Gold", points: "777+", color: "#212121", textColor: "white" }
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
                <Typography variant="h6" fontWeight="bold">{tier.level} Member</Typography>
                <Typography variant="body1">{tier.points}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Button variant="outlined" color="Accent" sx={{ px: 4, py: 1.5, borderRadius: 3 }} onClick={() => navigate("/register")}>
            Join Now
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Rewards;
