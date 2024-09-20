import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

// Define the type for the props
interface CardProps {
  title: string;
  count: number;
  description: string;
}

// Define the CardGlobel component with typed props
const CardGlobel: React.FC<CardProps> = ({ title, count, description }) => (
  <Card sx={{ minWidth: 275, margin: 1, height: 'auto' }}>
    <CardContent sx={{ padding: 1 }}>
      <Typography variant="h6" component="div" sx={{ marginBottom: 1 }}>
        {title}
      </Typography>
      <Typography sx={{ fontSize: 24, marginY: 1 }} color="text.primary" gutterBottom>
        {count}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ marginTop: 0.5 }}>
        {description}
      </Typography>
      
    </CardContent>
  </Card>
);

export default CardGlobel;
