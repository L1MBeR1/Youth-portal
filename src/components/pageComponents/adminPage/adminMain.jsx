import React from 'react';

import Sheet from '@mui/joy/Sheet';

import Blogs from './blogsSection';
import Podcasts from './podcastsSection';
import News from './newsSection';
import Events from './eventsSection';
import Projects from './projectsSection';

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
          return <Projects/>
        case 'events':
          return <Events/>
        case 'publications':
          return 
        case 'podcasts':
          return <Podcasts/>
        case 'blogs':
          return <Blogs/>
        case 'news':
          return <News/>
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