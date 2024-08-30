import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import BlogCreator from './BlogCreator';

function BlogWrapper() {
	return (
		<DndProvider backend={HTML5Backend}>
			<BlogCreator />
		</DndProvider>
	);
}

export default BlogWrapper;
