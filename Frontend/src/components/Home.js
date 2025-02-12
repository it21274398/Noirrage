import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { styled } from '@mui/system';
import CustProductList from '../../src/pages/Customer/CustProductList'

const HeroSection = styled(Box)(({ theme }) => ({
  height: '80vh',
  background: 'url(https://c0.wallpaperflare.com/preview/813/237/71/blur-blurred-background-boutique-clothes.jpg) center/cover no-repeat',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: 'white',
  textAlign: 'center',
  fontFamily: "'Raleway', sans-serif",
}));

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
      <Container
        maxWidth={false} // Removes the default container width constraints
        sx={{
          paddingLeft: 0, // Remove left padding
          paddingRight: 0, // Remove right padding
        }}
      >
        <CustProductList />
      </Container>
    </div>
  );
};

export default Home;
