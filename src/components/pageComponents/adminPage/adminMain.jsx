import React, { useEffect } from 'react';

import Sheet from '@mui/joy/Sheet';

import Blogs from './blogs'
  function AdminMain({section}) {
    const getContent = (section) => {
      switch (section) {
        case 'statistics':
          return
        case 'moderators':
          return 
        case 'organizations':
          return 
        case 'projects':
          return 
        case 'events':
          return 
        case 'publications':
          return 
        case 'podcasts':
          return 
        case 'blogs':
          return <Blogs/>
        case 'news':
          return 
        default:
          return '';
      }
    };
    return (
  
        <Sheet
        sx={{
  
          flexGrow:1,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          padding:{xs:'5px 10px',sm:'10px 20px',md:'30px 45px'},
          maxHeight:'100%',
          overflowY:{xs:'scroll',sm:'hidden'},
        }}
        >
        {getContent(section)}
        </Sheet>
    );
  }

export default AdminMain;