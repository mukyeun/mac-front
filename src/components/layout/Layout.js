import React from 'react';
mport { Box, Container } from '@mui/material';
mport Header from './Header';
mport Footer from './Footer';
const Layout = ({ children }) => {
 return (
   <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
     <Header />
     <Container component="main" sx={{ flex: 1, py: 4 }}>
       {children}
     </Container>
     <Footer />
   </Box>
 );
;
export default Layout;