import React, { useMemo, useCallback, useState } from "react";
import { createEditor, Node, Descendant, Transforms, Editor, Text } from "slate";
import { Slate, Editable, withReact, RenderElementProps } from "slate-react";

// This example is for an Editor with `ReactEditor` and `HistoryEditor`
import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'

type CustomElement = { type: 'paragraph'; children: CustomText[] }
type CustomText = { text: string; bold?: true }
type CustomCodeBlock = { 
  type: 'code';
  text: string;
  children: CustomText[]
}

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement | CustomCodeBlock
    Text: CustomText
  }
}

const App: React.FC = () => {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState<Descendant[]>([
    {
      type: "paragraph",
      children: [{ text: "A line of text in a paragraph." }]
    }
  ]);

// Define a rendering function based on the element passed to `props`. We use
  // `useCallback` here to memoize the function for subsequent renders.
  const renderElement = useCallback((props: RenderElementProps) => {
    switch (props.element.type) {
      case 'code':
        return <CodeElement {...props} />
      default:
        return <DefaultElement {...props} />
    }
  }, []);

  const renderLeaf = useCallback(props => {
    return <Leaf {...props} />
  }, [])

  return (
    <Slate 
      editor={editor} 
      value={value} 
      onChange={value => setValue(value)}
    >
      <Editable
onKeyDown={event => {
          if (!event.ctrlKey) {
            return
          }

          switch (event.key) {
            // When "`" is pressed, keep our existing code block logic.
            case '`': {
              event.preventDefault()
              const [match] = Editor.nodes(editor, {
                match: n => n.type === 'code',
              })
              Transforms.setNodes(
                editor,
                { type: match ? 'paragraph' : 'code' },
                { match: n => Editor.isBlock(editor, n) }
              )
              break
            }

            // When "B" is pressed, bold the text in the selection.
            case 'b': {
              event.preventDefault()
              Transforms.setNodes(
                editor,
                { bold: true },
                // Apply it to text nodes, and split the text node up if the
                // selection is overlapping only part of it.
                { match: n => Text.isText(n), split: true }
              )
              break
            }
          }
        }}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
     />
    </Slate>
  );
};

const Leaf = props => {
  return (
    <span
      {...props.attributes}
      style={{ fontWeight: props.leaf.bold ? 'bold' : 'normal' }}
    >
      {props.children}
    </span>
  )
}
const CodeElement = props => {
  return (
    <pre style={{backgroundColor: '#dddddd'}} {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  )
}

const DefaultElement = props => {
  console.log(props);
  return <p {...props.attributes}>{props.children}</p>
}

export default App;
