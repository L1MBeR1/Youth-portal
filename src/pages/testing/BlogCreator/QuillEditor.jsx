import Quill from 'quill';
import React, { useEffect, useRef } from 'react';

// Импорт тем Quill для редактора.
import 'quill/dist/quill.bubble.css';
import 'quill/dist/quill.snow.css';
// Своя тема для редактора. Переопределять и менять тут.
import './editor.css';

function QuillEditor({ value, onDataSend }) {
	const editorRef = useRef(null);
	const quillRef = useRef(null);

	useEffect(() => {
		if (quillRef.current) return;

		quillRef.current = new Quill(editorRef.current, {
			theme: 'snow',
			modules: {
				toolbar: [
					[{ header: [1, 2, 3, 4, 5, 6, false] }],
					['bold', 'italic', 'underline', 'strike'],
					['blockquote', 'code-block'],
					['link', 'image', 'video', 'formula'],
					[{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
					[{ script: 'sub' }, { script: 'super' }],
					[{ indent: '-1' }, { indent: '+1' }],
					[{ direction: 'rtl' }],
					[{ size: ['small', false, 'large', 'huge'] }],
					[{ color: [] }, { background: [] }],
					[{ font: [] }],
					[{ align: [] }],
					['clean'],
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

	return (
		<div
			className='blog-creator'
			ref={editorRef}
			style={{ minHeight: '300px', border: '1px solid #ddd' }}
		/>
	);
}

export default QuillEditor;
