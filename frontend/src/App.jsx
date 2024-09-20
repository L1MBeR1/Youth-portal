import React from 'react';
import {
	Navigate,
	Route,
	BrowserRouter as Router,
	Routes,
} from 'react-router-dom';

//Лейауты
import MainLayout from './components/layouts/mainLayout';

//Страницы
import Home from './pages/home';
import Login from './pages/login';
import MyContent from './pages/myContent';
import NotFound from './pages/notFound';
import Profile from './pages/profile';
import Recovery from './pages/recovery';
import Registration from './pages/registration';
import Settings from './pages/settings';

import BlogPage from './pages/blogPage';
import Blogs from './pages/blogs';

import NewsPage from './pages/newPage';
import News from './pages/news';

import PodcastPage from './pages/podcastPage';
import Podcasts from './pages/podcasts';

import EventPage from './pages/eventPage';
import Events from './pages/events';

import ProjectPage from './pages/projectPage';
import Projects from './pages/projects';

import OrganizationPage from './pages/organizationPage';
import Organizations from './pages/organizations';

import Admin from './pages/admin';
import Moderator from './pages/moderator';
import Su from './pages/su';

// <====== TEST =======>
import BlogCreator from './pages/testing/BlogCreator/BlogCreator';
import BlogWrapper from './pages/testing/v1/BlogWrapper';
import BlogCreatorV2 from './pages/testing/v2/BlogCreator';
// <===================>

//Роуты
import GuestRoute from './routes/guestRoute';
import NotGuestRoute from './routes/notGuestRoute';
import PrivateRoute from './routes/privateRoute';

import { CssBaseline } from '@mui/joy';
import { CssVarsProvider } from '@mui/joy/styles';
import './css/App.css';
//Тема
import theme from './themes/theme';

function App() {
	return (
		<CssVarsProvider theme={theme} defaultMode='system'>
			<CssBaseline />
			<Router>
				<Routes>
					<Route path='/' element={<MainLayout />}>
						<Route index element={<Home />} />
						<Route path='404' element={<NotFound />} />
						<Route path='*' element={<Navigate to='/404' />} />

						<Route path='blogs' element={<Blogs />} />
						<Route path='/blog/:id' element={<BlogPage />} />

						<Route path='news' element={<News />} />
						<Route path='/news/:id' element={<NewsPage />} />

						<Route path='podcasts' element={<Podcasts />} />
						<Route path='podcast/:id' element={<PodcastPage />} />

						<Route path='events' element={<Events />} />
						<Route path='event/:id' element={<EventPage />} />

						<Route path='projects' element={<Projects />} />
						<Route path='project/:id' element={<ProjectPage />} />

						<Route path='organizations' element={<Organizations />} />
						<Route path='organization/:id' element={<OrganizationPage />} />

						<Route path='/profile/:id' element={<Profile />} />

						<Route
							path='settings'
							element={<NotGuestRoute element={<Settings />} />}
						/>
						<Route
							path='my-content'
							element={<NotGuestRoute element={<MyContent />} />}
						/>

						<Route path='login' element={<GuestRoute element={<Login />} />} />
						<Route
							path='registration'
							element={<GuestRoute element={<Registration />} />}
						/>
						<Route
							path='recovery'
							element={<GuestRoute element={<Recovery />} />}
						/>

						{/* TODO: ! 
							Сделать маршрут для роли blogger
							/editor
						*/}
						<Route path='/test_blog_creator_v1' element={<BlogWrapper />} />
						<Route path='/test_blog_creator_v2' element={<BlogCreatorV2 />} />
						<Route path='/blog_creator' element={<BlogCreator />} />
					</Route>

					<Route
						path='/admin'
						element={<PrivateRoute element={<Admin />} roles={['admin']} />}
					/>
					<Route
						path='/moderator'
						element={
							<PrivateRoute element={<Moderator />} roles={['moderator']} />
						}
					/>
					<Route
						path='/su'
						element={<PrivateRoute element={<Su />} roles={['su']} />}
					/>
				</Routes>
			</Router>
		</CssVarsProvider>
	);
}

export default App;
