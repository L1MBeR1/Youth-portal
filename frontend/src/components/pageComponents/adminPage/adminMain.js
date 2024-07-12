import React, { useEffect } from 'react';

import Card from '@mui/joy/Card';
import Box from '@mui/joy/Box';
import Stack from '@mui/joy/Stack';
import Sheet from '@mui/joy/Sheet';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import FormHelperText from '@mui/joy/FormHelperText';
import IconButton from '@mui/joy/IconButton';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton, { listItemButtonClasses } from '@mui/joy/ListItemButton';
import ListItemContent from '@mui/joy/ListItemContent';

import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import BusinessIcon from '@mui/icons-material/Business';
import ShieldIcon from '@mui/icons-material/Shield';
import BarChartIcon from '@mui/icons-material/BarChart';
import EventIcon from '@mui/icons-material/Event';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import PublishIcon from '@mui/icons-material/Publish';

import { getBlogs } from '../../../api/adminApi';
import {getCookie} from '../../../cookie/cookieUtils';
import AdminMainContent from './adminMainContent'
const sectionNames = {
    statistics: 'Статистика',
    moderators: 'Модераторы',
    organizations: 'Организации',
    projects: 'Проекты',
    events: 'Мероприятия',
    publications: 'Публикации',
    podcasts: 'Подкасты',
    blogs: 'Блоги',
    news: 'Новости',
    default: 'Выберите раздел'
  };

function AdminMain({section }) {
  return (
    <main>
      <Sheet
      sx={{

        flexGrow:1,
        p: 2,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        padding:'30px 45px',
        maxHeight:'100%',
        overflow:'hidden',
      }}
      >
        <Typography  fontWeight={700} fontSize={30}>
           {sectionNames[section] || 'Выберите раздел'}
        </Typography>
        {section ==='blogs' ?(<AdminMainContent/>):(<></>)}
      </Sheet>
    </main>
  );
}

export default AdminMain;