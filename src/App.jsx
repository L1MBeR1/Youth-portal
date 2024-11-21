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

import ResetPassword from './pages/resetPassword';
// <===================>

//Роуты
import GuestRoute from './routes/guestRoute';
import NotGuestRoute from './routes/notGuestRoute';
import PrivateRoute from './routes/privateRoute';

import { CssBaseline } from '@mui/joy';
import { CssVarsProvider } from '@mui/joy/styles';
import './css/App.css';
//Тема
import { Toaster } from 'sonner';

import BloggersSection from './pages/admin/bloggersSection';
import EventsSection from './pages/admin/eventsSection';
import ModeratorsSection from './pages/admin/moderatorsSection';
import OrganizationsSection from './pages/admin/organizationsSection';
import ProjectsSection from './pages/admin/projectsSection';
import AuthCallback from './pages/authCallback';
import BlogRoleRequest from './pages/blogRoleRequest';
import ModeratorBlogsSection from './pages/moderator/blogsSection';
import ModeratorNewsSection from './pages/moderator/newsSection';
import ModeratorPodcastsSection from './pages/moderator/podcastsSection';
import BlogsSection from './pages/my-content/blogsSection';
import CreateBlog from './pages/my-content/createBlog';
import CreateNews from './pages/my-content/createNews';
import CreatePodcast from './pages/my-content/createPodacast';
import NewsSection from './pages/my-content/newsSection';
import PodcastsSection from './pages/my-content/podcastsSection';
import AccountSection from './pages/settings/accountSection';
import PublicAccountSection from './pages/settings/publicAccountSection';
import SecuritySection from './pages/settings/securitySecrion';
import theme from './themes/theme';

function App() {
	return (
		<CssVarsProvider theme={theme} defaultMode='system'>
			<CssBaseline />
			<Toaster richColors toastOptions={{ duration: 5000 }} />
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
						>
							<Route index element={<Navigate to='/settings/account' />} />
							<Route path='account' element={<AccountSection />} />
							<Route path='public' element={<PublicAccountSection />} />
							<Route path='security' element={<SecuritySection />} />
						</Route>

						{/* Мой контент */}
						<Route
							path='my-content'
							element={<NotGuestRoute element={<MyContent />} />}
						>
							<Route index element={<Navigate to='/404' />} />
							<Route
								path='blogs'
								element={
									<PrivateRoute
										element={<BlogsSection />}
										roles={['blogger']}
									/>
								}
							/>

							<Route
								path='podcasts'
								element={
									<PrivateRoute
										element={<PodcastsSection />}
										roles={['blogger']}
									/>
								}
							/>
							<Route
								path='news'
								element={
									<PrivateRoute
										element={<NewsSection />}
										roles={['news_creator']}
									/>
								}
							/>
							<Route
								path='blogs/create'
								element={
									<PrivateRoute element={<CreateBlog />} roles={['blogger']} />
								}
							/>
							<Route
								path='podcasts/create'
								element={
									<PrivateRoute
										element={<CreatePodcast />}
										roles={['blogger']}
									/>
								}
							/>
							<Route
								path='news/create'
								element={
									<PrivateRoute
										element={<CreateNews />}
										roles={['news_creator']}
									/>
								}
							/>
						</Route>

						<Route
							path='request/blogger'
							element={<NotGuestRoute element={<BlogRoleRequest />} />}
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
						<Route path='reset-password' element={<ResetPassword />} />
						{/* TODO: ! 
							Сделать маршрут для роли blogger
							/editor
						*/}
						{/* <Route path='/test_blog_creator_v1' element={<BlogWrapper />} />
						<Route path='/test_blog_creator_v2' element={<BlogCreatorV2 />} />
						<Route path='/blog_creator' element={<BlogCreator />} /> */}
					</Route>
					<Route
						path='auth/callback'
						element={<GuestRoute element={<AuthCallback />} />}
					/>
					<Route
						path='/admin'
						element={<PrivateRoute element={<Admin />} roles={['admin']} />}
					/>
					<Route
						path='/admin'
						element={<PrivateRoute element={<Admin />} roles={['admin']} />}
					>
						<Route index element={<Navigate to='/admin/moderators' />} />
						<Route path='moderators' element={<ModeratorsSection />} />
						<Route path='bloggers' element={<BloggersSection />} />
						<Route path='organizations' element={<OrganizationsSection />} />
						<Route path='projects' element={<ProjectsSection />} />
						<Route path='events' element={<EventsSection />} />
						<Route path='blogs' element={<ModeratorBlogsSection />} />
						<Route path='news' element={<ModeratorNewsSection />} />
						<Route path='podcasts' element={<ModeratorPodcastsSection />} />
					</Route>

					<Route
						path='/moderator'
						element={
							<PrivateRoute element={<Moderator />} roles={['moderator']} />
						}
					>
						<Route index element={<Navigate to='/moderator/blogs' />} />
						<Route path='blogs' element={<ModeratorBlogsSection />} />
						<Route path='news' element={<ModeratorNewsSection />} />
						<Route path='podcasts' element={<ModeratorPodcastsSection />} />
					</Route>

					<Route
						path='/su'
						element={<PrivateRoute element={<Su />} roles={['su']} />}
					>
						<Route index element={<Navigate to='/su/moderators' />} />
						<Route path='moderators' element={<ModeratorsSection />} />
						<Route path='bloggers' element={<BloggersSection />} />
						<Route path='organizations' element={<OrganizationsSection />} />
						<Route path='projects' element={<ProjectsSection />} />
						<Route path='events' element={<EventsSection />} />
						<Route path='blogs' element={<ModeratorBlogsSection />} />
						<Route path='news' element={<ModeratorNewsSection />} />
						<Route path='podcasts' element={<ModeratorPodcastsSection />} />
					</Route>
				</Routes>
			</Router>
		</CssVarsProvider>
	);
}

export default App;
