export const getStatus = status => {
	switch (status) {
		case 'moderating':
			return {
				label: 'На проверке',
				color: 'warning',
			};
		case 'published':
			return {
				label: 'Опубликован',
				color: 'success',
			};
		case 'archived':
			return {
				label: 'Архивирован',
				color: 'neutral',
			};
		case 'pending':
			return {
				label: 'На доработке',
				color: 'danger',
			};
		default:
			return {
				label: status,
				color: 'neutral',
			};
	}
};
