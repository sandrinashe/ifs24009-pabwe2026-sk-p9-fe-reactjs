import Editor from '@toast-ui/editor'
import '@toast-ui/editor/dist/toastui-editor.css'
import { useEffect, useRef } from 'react'

/** Wrapper Toast UI Editor (WYSIWYG & Markdown) untuk menulis konten artikel. */
export default function MarkdownEditor({ value, onChange, labelledBy }) {
  const host = useRef(null)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  useEffect(() => {
    const editor = new Editor({
      el: host.current,
      initialValue: value ?? '',
      initialEditType: 'markdown',
      previewStyle: window.innerWidth >= 1024 ? 'vertical' : 'tab',
      height: '460px',
      usageStatistics: false,
      placeholder: 'Tulis artikel Anda dengan Markdown...',
      events: { change: () => onChangeRef.current(editor.getMarkdown()) },
    })
    host.current.querySelectorAll('[contenteditable="true"]').forEach((node) => node.setAttribute('aria-labelledby', labelledBy))
    return () => editor.destroy()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div ref={host} />
}
