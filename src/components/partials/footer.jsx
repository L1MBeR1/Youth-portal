import React from 'react';

import { Box, Stack, Input, Button, IconButton } from '@mui/joy';
import { useColorScheme } from '@mui/joy/styles';
import Typography from '@mui/joy/Typography';

import CropSquareIcon from '@mui/icons-material/CropSquare';
import SendIcon from '@mui/icons-material/Send';

import vk from '../../img/social/vk.svg';
import telegram from '../../img/social/telegram.svg';
import youtube from '../../img/social/youtube.svg';
import Logo from './logo';

function Footer() {
	return (
		<footer>
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
							level='title-xl'
							textColor={'var(--joy-staticColors-mainLight)'}
						>
							Подпишись на наши обновления и будь в курсе всех событий!
						</Typography>
						<Input
							color={'neutral'}
							size={'md'}
							placeholder='Введите почту'
							endDecorator={
								<IconButton variant='solid' color='primary'>
									<SendIcon fontSize='20px' />
								</IconButton>
							}
							sx={{
								'--Input-decoratorChildHeight': { sm: '40px', mdx: '50px' },
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
							<Typography textColor={'var(--joy-staticColors-mainLight)'}>
								Блоги
							</Typography>
							<Typography textColor={'var(--joy-staticColors-mainLight)'}>
								Новости
							</Typography>
							<Typography textColor={'var(--joy-staticColors-mainLight)'}>
								Подкасты
							</Typography>
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
