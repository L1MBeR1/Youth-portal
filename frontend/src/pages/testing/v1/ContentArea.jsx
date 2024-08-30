import { Box } from '@mui/joy';
import React, { useRef, useState } from 'react';
import ContentEditable from 'react-contenteditable';
import { useDrop } from 'react-dnd';

const ItemTypes = {
	TEMPLATE: 'template',
};

function InsertionIndicator({ show, position }) {
	return (
		show && (
			<Box
				sx={{
					position: 'absolute',
					top: position.y,
					left: position.x,
					width: '100%',
					height: '4px',
					backgroundColor: '#00a',
					zIndex: 1000,
					transition: 'all 0.2s ease-in-out',
				}}
			/>
		)
	);
}

function BlockContainer({
	children,
	index,
	onDropInside,
	editable,
	onContentChange,
	onHover,
}) {
	const [{ isOverCurrent }, drop] = useDrop({
		accept: ItemTypes.TEMPLATE,
		drop: item => onDropInside(item, index),
		hover: (_, monitor) => {
			if (monitor.isOver({ shallow: true })) {
				onHover(index);
			}
		},
		collect: monitor => ({
			isOverCurrent: monitor.isOver({ shallow: true }),
		}),
	});

	return (
		<Box
			ref={drop}
			sx={{
				position: 'relative',
				margin: '16px 0',
				padding: 2,
				borderRadius: 2,
				backgroundColor: isOverCurrent ? '#f0f0f0' : '#fff',
				border: isOverCurrent ? '2px dashed #00a' : '1px solid #ddd',
				transition:
					'background-color 0.2s ease-in-out, border 0.2s ease-in-out',
				'&:hover': {
					boxShadow: '0 0 5px rgba(0,0,0,0.1)',
				},
			}}
		>
			<ContentEditable
				html={children}
				disabled={!editable}
				onChange={e => onContentChange(e.target.value, index)}
				tagName='div'
				style={{ minHeight: '50px', outline: 'none' }}
			/>
		</Box>
	);
}

function ContentArea() {
	const [content, setContent] = useState([]);
	const [hoveredIndex, setHoveredIndex] = useState(null);
	const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
	const dropRef = useRef(null);

	const [, drop] = useDrop({
		accept: ItemTypes.TEMPLATE,
		drop: item => {
			const newBlock = generateBlock(item);
			if (hoveredIndex !== null) {
				const updatedContent = [...content];
				updatedContent.splice(hoveredIndex + 1, 0, newBlock);
				setContent(updatedContent);
			} else {
				setContent(prevContent => [...prevContent, newBlock]);
			}
			setHoveredIndex(null);
		},
	});

	function generateBlock(item) {
		switch (item.type) {
			case 'two-column-text':
				return {
					type: 'two-column-text',
					content:
						'<div style="display: flex; justify-content: space-between; gap: 16px;"><div style="flex: 1; padding: 8px; border: 1px dashed #ccc;">Column 1</div><div style="flex: 1; padding: 8px; border: 1px dashed #ccc;">Column 2</div></div>',
				};
			case 'picture-and-text':
				return {
					type: 'picture-and-text',
					content:
						'<div style="display: flex; align-items: center;"><img src="https://via.placeholder.com/150" alt="Placeholder" style="width: 150px; height: auto; margin-right: 10px; border-radius: 4px;" /><div style="flex: 1; padding: 8px; border: 1px dashed #ccc;">Text next to image</div></div>',
				};
			case 'full-width-image':
				return {
					type: 'full-width-image',
					content:
						'<img src="https://via.placeholder.com/600x300" alt="Placeholder" style="width: 100%; height: auto; border-radius: 4px;" />',
				};
			default:
				return null;
		}
	}

	function handleContentChange(newContent, index) {
		const updatedContent = [...content];
		updatedContent[index] = { ...updatedContent[index], content: newContent };
		setContent(updatedContent);
	}

	function handleDropInside(item, index) {
		const newBlock = generateBlock(item);
		const updatedContent = [...content];
		updatedContent.splice(index + 1, 0, newBlock);
		setContent(updatedContent);
	}

	function handleHover(index) {
		setHoveredIndex(index);
	}

	return (
		<Box
			ref={node => {
				drop(node);
				dropRef.current = node;
			}}
			sx={{
				position: 'relative',
				border: '1px solid #ddd',
				minHeight: '300px',
				padding: 2,
				backgroundColor: '#fff',
				borderRadius: 2,
				overflowY: 'auto',
			}}
		>
			{content.map((block, index) => (
				<React.Fragment key={index}>
					<InsertionIndicator
						show={hoveredIndex === index}
						position={{
							x: 0,
							y: dropRef.current
								? dropRef.current.children[index]?.getBoundingClientRect()
										.bottom - dropRef.current.getBoundingClientRect().top
								: 0,
						}}
					/>
					<BlockContainer
						index={index}
						onDropInside={handleDropInside}
						editable={true}
						onContentChange={handleContentChange}
						onHover={handleHover}
					>
						{block.content}
					</BlockContainer>
				</React.Fragment>
			))}
		</Box>
	);
}

export default ContentArea;
