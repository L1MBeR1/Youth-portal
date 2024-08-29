import Quill from 'quill';
import React, { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';

// Editor is an uncontrolled React component
const Editor = forwardRef(
	(
		{ readOnly, defaultValue, onTextChange, onSelectionChange, onDataSend },
		ref
	) => {
		const containerRef = useRef(null);
		const defaultValueRef = useRef(defaultValue);
		const onTextChangeRef = useRef(onTextChange);
		const onSelectionChangeRef = useRef(onSelectionChange);

		useLayoutEffect(() => {
			onTextChangeRef.current = onTextChange;
			onSelectionChangeRef.current = onSelectionChange;
		});

		// const sendDataToParent = () => {
		//     const content = quillRef.current.getContents().ops[0].insert;

		//     onDataSend(content);
		// };

		// Подписка на событие изменения текста в редакторе
		// quillRef.current.on('text-change', sendDataToParent);

		useEffect(() => {
			ref.current?.enable(!readOnly);
		}, [ref, readOnly]);

		useEffect(() => {
			const container = containerRef.current;
			const editorContainer = container.appendChild(
				container.ownerDocument.createElement('div')
			);
			const quill = new Quill(editorContainer, {
				theme: 'bubble',
			});

			ref.current = quill;

			if (defaultValueRef.current) {
				quill.setContents(defaultValueRef.current);
			}

			quill.on(Quill.events.TEXT_CHANGE, (...args) => {
				onTextChangeRef.current?.(...args);
				console.log(...args);
			});

			quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
				onSelectionChangeRef.current?.(...args);
			});

			return () => {
				ref.current = null;
				container.innerHTML = '';
			};
		}, [ref]);

		return <div ref={containerRef}></div>;
	}
);

Editor.displayName = 'Editor';

export default Editor;
