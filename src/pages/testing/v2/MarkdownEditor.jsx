import React from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';

function MarkdownEditor({ onUpdate }) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image,
            Link,
        ],
        content: '<p>Hello World! 🌎</p>',
        onUpdate: ({ editor }) => {
            onUpdate(editor.getHTML());
        },
    });

    return (
        <div>
            <EditorContent editor={editor} />
        </div>
    );
}

export default MarkdownEditor;
