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
import NotFound from './pages/notFound';
import Profile from './pages/profile';
import Recovery from './pages/recovery';
import Registration from './pages/registration';

import BlogPage from './pages/blogPage';
import Blogs from './pages/blogs';

import NewsPage from './pages/newPage';
import News from './pages/news';

import PodcastPage from './pages/podcastPage';
import Podcasts from './pages/podcasts';

import Admin from './pages/admin';
import Moderator from './pages/moderator';
import Su from './pages/su';

//Роуты
import GuestRoute from './routes/guestRoute';
import NotGuestRoute from './routes/notGuestRoute';
import PrivateRoute from './routes/privateRoute';

import { CssBaseline } from '@mui/joy';
import { CssVarsProvider } from '@mui/joy/styles';
import './css/App.css';

function App() {
	return (
		<CssVarsProvider>
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
						<Route path='podcasts/:id' element={<PodcastPage />} />

						{/* Пути только для гостя */}
						<Route path='login' element={<GuestRoute element={<Login />} />} />
						<Route
							path='registration'
							element={<GuestRoute element={<Registration />} />}
						/>
						<Route
							path='recovery'
							element={<GuestRoute element={<Recovery />} />}
						/>

						{/* Пути не для гостя */}
						<Route path='/profile/:id' element={<Profile />} />
					</Route>

					{/* Служебные пути */}
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
