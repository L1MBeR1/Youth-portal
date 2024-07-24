import React,{useState,useEffect} from 'react';
import { useQueryClient } from '@tanstack/react-query';

import Stack from '@mui/joy/Stack';

import Header from '../components/adminPage/adminHeader';
import AdminSidebar from '../components/adminPage/adminSidebar'
import AdminMain from '../components/adminPage/adminMain';
function WorkLayout() {

const [section, setSection] = useState('moderators');
const [open, setOpen] = useState(false);

const queryClient = useQueryClient();

  useEffect(() => {
    return () => {
      console.log('Удаление кэша админа');
      queryClient.removeQueries({
        predicate: (query) => {
          return query.meta?.tags?.includes('admin');
        },
      });
    };
  }, [queryClient]); 

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
