import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer'
import '@toast-ui/editor/dist/toastui-editor-viewer.css'
import { useEffect, useRef } from 'react'

export default function MarkdownViewerImpl({ content }) {
  const host = useRef(null)

  useEffect(() => {
    const viewer = new Viewer({ el: host.current, initialValue: content })
    return () => viewer.destroy()
  }, [content])

  return <div ref={host} className="prose-post" />
}
