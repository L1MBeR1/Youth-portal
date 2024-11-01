import Quill from 'quill';
import React, { useEffect, useRef } from 'react';

// Импорт тем Quill для редактора.
import 'quill/dist/quill.bubble.css';
import 'quill/dist/quill.snow.css';
// Своя тема для редактора. Переопределять и менять тут.
import { Sheet } from '@mui/joy';
import './editor.css';

function QuillEditor({ value, onDataSend, isLoading }) {
	const editorRef = useRef(null);
	const quillRef = useRef(null);

	useEffect(() => {
		if (quillRef.current) return;

		quillRef.current = new Quill(editorRef.current, {
			theme: 'snow',
			modules: {
				toolbar: [
					[
						{ header: [1, 2, 3, 4, 5, 6, false] },
						{ size: ['small', false, 'large', 'huge'] },
						{ font: [] },
						{ align: [] },
					],
					[
						'bold',
						'italic',
						'underline',
						'strike',
						{ color: [] },
						{ background: [] },
					],
					['blockquote', 'code-block', 'link', 'image', 'video', 'formula'],
					[{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
					[{ script: 'sub' }, { script: 'super' }],
					[{ direction: 'rtl' }],
				],
			},
		});

		const sendDataToParent = data => {
			onDataSend(data);
		};

		quillRef.current.on('text-change', () => {
			const content = quillRef.current.getContents().ops[0].insert;
			sendDataToParent(content);
		});

		if (value) {
			quillRef.current.setContents(value);
		}

		// Добавление подсказок к элементам тулбара
		// const toolbarButtons = editorRef.current.querySelectorAll('.ql-toolbar button');

		// toolbarButtons.forEach(button => {
		//     const tooltipText = button.className.split(' ')[1]?.replace('ql-', '') || 'Button';
		//     const tooltip = document.createElement('span');
		//     tooltip.className = 'tooltip';
		//     tooltip.textContent = tooltipText;

		//     button.classList.add('toolbar-button');
		//     button.style.position = 'relative';
		//     button.appendChild(tooltip);
		// });

		return () => {
			if (quillRef.current) {
				quillRef.current.off('text-change', sendDataToParent);
			}
		};
	}, [onDataSend, value]);

	useEffect(() => {
		if (quillRef.current) {
			quillRef.current.enable(!isLoading);
		}
	}, [isLoading]);

	return (
		<Sheet
			className='blog-creator'
			ref={editorRef}
			sx={{
				background: 'var(--joy-palette-main-background)',
				minHeight: '300px',
				borderRadius: '0 0 20px 20px',
			}}
		/>
	);
}

export default QuillEditor;
