import Quill from 'quill';
import 'quill/dist/quill.bubble.css';
import 'quill/dist/quill.snow.css';
import React, { useEffect, useRef } from 'react';

function QuillEditor({ value, onChange }) {
	const editorRef = useRef(null);
	const quillRef = useRef(null);

	useEffect(() => {
		if (quillRef.current) return; // Initialize only once

		quillRef.current = new Quill(editorRef.current, {
			theme: 'bubble',
			modules: {
				toolbar: [
					[{ header: [1, 2, false] }],
					['bold', 'italic', 'underline'],
					[{ list: 'ordered' }, { list: 'bullet' }],
					[{ script: 'sub' }, { script: 'super' }],
					['link', 'image'],
					[{ color: [] }, { background: [] }],
					[{ font: [] }],
					['clean'],
				],
			},
		});

		// Update the content when the editor's content changes
		quillRef.current.on('text-change', () => {
			onChange(quillRef.current.root.innerHTML);
		});

		// Set the initial content
		quillRef.current.root.innerHTML = value || '';

		return () => {
			if (quillRef.current) {
				quillRef.current.off('text-change');
			}
		};
	}, [value, onChange]);

	return (
		<div
			ref={editorRef}
			style={{
				minHeight: '300px',
				border: '1px solid #ddd',
				borderRadius: '4px',
			}}
		/>
	);
}

export default QuillEditor;
