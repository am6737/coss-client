import clsx from 'clsx'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

import './ToolEditor.scss'
// import { Editor } from '..'
import { useFocus } from '@reactuses/core'
import Quill from 'quill'
import { $t } from '@/shared'

interface ToolEditorProps {
	className?: string
	readonly?: boolean
	// options?: EngineOptions
	// defaultValue?: string
	// is_group?: boolean
	focus?: () => void
	blur?: () => void
	initValue?: string
	content?: string
	children?: React.ReactNode
}

// 暴露给父组件的方法类型
export interface ToolEditorMethods {
	// engine: Editor
	// el: HTMLDivElement
	focus: () => void
	// isFocus: boolean
	quill: Quill
}

const ToolEditor: React.ForwardRefRenderFunction<ToolEditorMethods, ToolEditorProps> = (props, ref) => {
	const EditorRef = useRef<HTMLDivElement | null>(null)

	// const [engine, setEngine] = useState<Editor>()
	const [, setEditorFocus] = useFocus(EditorRef, true)

	const [quill, setQuill] = useState<Quill>()

	useEffect(() => {
		if (!EditorRef.current) return

		const quill = new Quill(EditorRef.current, {
			readOnly: props?.readonly ?? true,
			placeholder: props?.readonly ? '' : $t('请输入内容')
			// theme: 'snow'
		})

		setQuill(quill)
	}, [])

	useEffect(() => {
		if (quill && props.initValue) {
			quill.root.innerHTML = props.initValue
		}
	}, [quill, props.initValue])

	useImperativeHandle(ref, () => ({
		focus: () => setEditorFocus(true),
		quill: quill!
	}))

	return (
		<div
			className={clsx('w-full text-[1rem]', props.className)}
			ref={EditorRef}
			onFocus={props.focus}
			onBlur={props.blur}
		>
			{props?.children}
		</div>
	)
}

export const EditorComponent = forwardRef(ToolEditor)
export default EditorComponent
