import { IconButton, Input, Link, Stack } from '@mui/joy';
import Typography from '@mui/joy/Typography';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import SendIcon from '@mui/icons-material/Send';

import telegram from '../../img/social/telegram.svg';
import vk from '../../img/social/vk.svg';
import youtube from '../../img/social/youtube.svg';

function Footer() {
	return (
		<footer style={{ zIndex: '1000' }}>
			<Stack
				justifyContent={'space-between'}
				sx={{
					margin: { xs: '15px', sm: '40px' },
					flexDirection: { xs: 'column', md: 'row' },
					gap: '50px',
					minHeight: '300px',
					borderRadius: '30px',
					background: 'var(--joy-palette-main-surface0)',
					padding: { xs: '25px' },
				}}
			>
				<Stack
					direction={'column'}
					flexGrow={1}
					justifyContent={'space-between'}
					spacing={2}
					sx={{
						maxWidth: { xs: '100%', md: '30%' },
					}}
				>
					<Stack direction={'column'} flexGrow={1} spacing={2}>
						<Typography
							level='title-xxl'
							textColor={'var(--joy-staticColors-mainLight)'}
						>
							Подпишись на наши обновления и будь в курсе всех событий!
						</Typography>
						<Input
							color={'neutral'}
							size={'md'}
							placeholder='Введите почту'
							endDecorator={
								<IconButton
									variant='solid'
									color='primary'
									sx={{
										borderRadius: '100px',
									}}
								>
									<SendIcon />
								</IconButton>
							}
							sx={{
								'--Input-decoratorChildHeight': { sm: '40px', mdx: '40px' },
								'--Input-gap': '10px',
								'--Input-radius': '50px',
								'--Input-minHeight': { sm: '40px', mdx: '50px' },
								'--Input-paddingInline': '18px',
							}}
						/>
					</Stack>

					<Stack
						direction={'row'}
						spacing={1}
						sx={{ display: { xs: 'none', md: 'flex' } }}
					>
						<img width='35px' alt='vk' src={vk} />
						<img width='35px' alt='youtube' src={youtube} />
						<img width='35px' alt='telegram' src={telegram} />
					</Stack>
				</Stack>
				<Stack
					direction={'column'}
					justifyContent={'space-between'}
					flexGrow='1'
					spacing={3}
				>
					<Stack
						direction={'row'}
						sx={{
							justifyContent: { xs: 'space-between', md: 'space-evenly' },
						}}
					>
						<Stack direction={'column'}>
							<Typography textColor={'var(--joy-staticColors-mainLight)'}>
								О нас
							</Typography>
							<Typography textColor={'var(--joy-staticColors-mainLight)'}>
								Контакты
							</Typography>
							<Typography textColor={'var(--joy-staticColors-mainLight)'}>
								Правила использования
							</Typography>
							<Typography textColor={'var(--joy-staticColors-mainLight)'}>
								Помощь
							</Typography>
							<Typography textColor={'var(--joy-staticColors-mainLight)'}>
								Реклама и партнёры
							</Typography>
							<Typography textColor={'var(--joy-staticColors-mainLight)'}>
								Карта сайта
							</Typography>
						</Stack>
						<Stack direction={'column'}>
							<Link color='neutral' component={RouterLink} to='/blogs'>
								<Typography textColor={'var(--joy-staticColors-mainLight)'}>
									Блоги
								</Typography>
							</Link>
							<Link color='neutral' component={RouterLink} to='/news'>
								<Typography textColor={'var(--joy-staticColors-mainLight)'}>
									Новости
								</Typography>
							</Link>
							<Link color='neutral' component={RouterLink} to='/podcasts'>
								<Typography textColor={'var(--joy-staticColors-mainLight)'}>
									Подкасты
								</Typography>
							</Link>
							<Link color='neutral' component={RouterLink} to='/events'>
								<Typography textColor={'var(--joy-staticColors-mainLight)'}>
									Мероприятия
								</Typography>
							</Link>
							<Link color='neutral' component={RouterLink} to='/projects'>
								<Typography textColor={'var(--joy-staticColors-mainLight)'}>
									Проекты
								</Typography>
							</Link>
							<Link color='neutral' component={RouterLink} to='/organizations'>
								<Typography textColor={'var(--joy-staticColors-mainLight)'}>
									Организации
								</Typography>
							</Link>
						</Stack>
					</Stack>
					<Stack
						direction={'row'}
						spacing={1}
						flexGrow={1}
						sx={{
							display: {
								xs: 'flex',
								md: 'none',
							},
							justifyContent: { xs: 'space-evenly', md: 'flex-start' },
						}}
					>
						<img width='35px' alt='vk' src={vk} />
						<img width='35px' alt='youtube' src={youtube} />
						<img width='35px' alt='telegram' src={telegram} />
					</Stack>
					<Stack
						justifyContent={'flex-end'}
						gap={'50px'}
						sx={{
							flexDirection: { sx: 'column', md: 'row' },
						}}
					>
						<Typography level='info'>
							© 2024 Молодежный портал. Все права защищены.
						</Typography>
					</Stack>
				</Stack>
			</Stack>
		</footer>
	);
}
export default Footer;
