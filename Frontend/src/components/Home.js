import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import { styled } from '@mui/system';
import CustProductList from '../../src/pages/Customer/CustProductList';

const HeroSection = styled(Box)(({ theme }) => ({
  height: '80vh',
  background: 'url(https://c0.wallpaperflare.com/preview/813/237/71/blur-blurred-background-boutique-clothes.jpg) center/cover no-repeat',
  backgroundSize: 'cover',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  color: '#fff',
  fontFamily: "'Raleway', sans-serif",
  padding: '0 20px',
  zIndex: 1,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.6)',
    zIndex: -1,
  },
}));

const HeroTitle = styled(Typography)(({ theme }) => ({
  fontSize: '3rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '2px',
  [theme.breakpoints.down('md')]: {
    fontSize: '2.5rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '2rem',
  },
}));

const HeroSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 300,
  marginTop: '10px',
  maxWidth: '600px',
  [theme.breakpoints.down('md')]: {
    fontSize: '1.3rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.1rem',
  },
}));

const HeroButton = styled(Button)(({ theme }) => ({
   to:"/CustProductList",
  marginTop: '20px',
  padding: '12px 30px',
  fontSize: '1rem',
  fontWeight: 500,
  textTransform: 'none',
  backgroundColor: '#ff6f61',
  color: '#fff',
  borderRadius: '8px',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    backgroundColor: '#e65b50',
    transform: 'scale(1.05)',
  },
}));

const FullWidthSection = styled(Box)({
  width: '100%', // Ensures full width
  padding: '40px 0', // Adds spacing on top and bottom
 
});

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <HeroSection>
        <HeroTitle variant="h1">Noirrage</HeroTitle>
        <HeroSubtitle variant="h6">
          Elevate your fashion with our exclusive collections
        </HeroSubtitle>
        <HeroButton variant="contained">Shop Now</HeroButton>
      </HeroSection>

      {/* Featured Products Section - Full Width */}
      <FullWidthSection>
        <Typography
       
          variant="h4" 
          textAlign="center" 
          fontWeight={600} 
          mb={4}
          sx={{
            color: 'white',
            fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' }
          }}
        >
          Featured Products
        </Typography>
        
        {/* Directly Rendering CustProductList without a Container */}
        <CustProductList />
      </FullWidthSection>
    </div>
  );
};

export default Home;
