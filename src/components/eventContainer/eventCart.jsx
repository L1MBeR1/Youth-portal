import React from 'react';

import Card from '@mui/joy/Card';
import CardOverflow from '@mui/joy/CardOverflow';
import CardContent from '@mui/joy/CardContent';
import AspectRatio from '@mui/joy/AspectRatio';
import Typography from '@mui/joy/Typography';
import CardActions from '@mui/joy/CardActions';
import Button from '@mui/joy/Button';

import BlankImage from '../../img/blank.png';
function EventCart(props) {
    return (
        <Card
        sx={{
            height:{xs:"400px",sm:'350px'}
         }}>
            <CardOverflow>
            <AspectRatio minHeight="120px" maxHeight="200px">
                <img
                src={BlankImage}
                loading="lazy"
                alt=""
                />
            </AspectRatio>
            </CardOverflow>
            <CardContent>
                <Typography level="title-md">{props.title}</Typography>
                <Typography 
                sx={{
                   overflow:'hidden',
                    textOverflow:'ellipsis',
                    display:'-webkit-box',
                    WebkitLineClamp:'4',
                    WebkitBoxOrient:'vertical',
                }}
                level="body-sm">{props.description}</Typography>
            </CardContent>
            <CardActions>
                <Button variant="solid">Узнать больше</Button>
            </CardActions>
        </Card>
    );
  }
  export default EventCart;