import React,{useState} from 'react';

import Stack from '@mui/joy/Stack';

import Header from '../components/adminPage/adminHeader';
import AdminSidebar from '../components/adminPage/adminSidebar'
import AdminMain from '../components/adminPage/adminMain';
function WorkLayout() {
const [section, setSection] = useState('statistics');
const [open, setOpen] = useState(false);
  return (
    <Stack 
    sx={{
      minHeight:'100vh',
      overflow:'hidden',
      maxHeight:'100vh',
    }}
    >
      <Header setOpen={setOpen} open={open}/>
      <main className='layout-main'
      >
        <Stack
            direction="row"
            sx={{
            flexGrow:1,
            overflow:'hidden',
            }}
            >
            <AdminSidebar
            selectedSection={section} 
            setSection={setSection}
            open={open}
            setOpen={setOpen}
            />
            <AdminMain section={section}/>
        </Stack>
      </main>
    </Stack>
  );
}

export default WorkLayout;
