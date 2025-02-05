import React from 'react';
import { Container, Grid, Typography, Button, Card, CardMedia, CardContent, Box } from '@mui/material';
import { styled } from '@mui/system';
import CustProduct from "../pages/ProductList"


const HeroSection = styled(Box)(({ theme }) => ({
  height: '80vh',
  background: 'url(https://c0.wallpaperflare.com/preview/813/237/71/blur-blurred-background-boutique-clothes.jpg) center/cover no-repeat',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: 'white',
  textAlign: 'center',
}));

const ProductCard = ({ image, title, price }) => (
  <Card sx={{ maxWidth: 345 }}>
    <CardMedia
      component="img"
      alt={title}
      height="200"
      image={image}
    />
    <CardContent>
      <Typography gutterBottom variant="h6" component="div">
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {price}
      </Typography>
    </CardContent>
  </Card>
);

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <HeroSection>
        <Typography variant="h1" component="h1" gutterBottom>
        Noirrage
        </Typography>
       
      </HeroSection>

      {/* Featured Products Section */}
      <Container sx={{ py: 4 }}>
        <CustProduct/>
      </Container>

    
    </div>
  );
};

export default Home;
