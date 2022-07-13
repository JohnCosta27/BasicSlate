import React, { useMemo, useCallback, useState } from "react";
import { createEditor, Descendant, Editor, Transforms, Node } from "slate";
import { Slate, Editable, withReact, RenderElementProps } from "slate-react";

// This example is for an Editor with `ReactEditor` and `HistoryEditor`
import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";
import DefaultBlock from "./Elements/DefaultBlock";
import Paragraph from "./Elements/Paragraph";

type CustomElement = { type: "block"; children: CustomText[] | RedElement[] };
type RedElement = { type: "red"; children: CustomText[] };
type CustomText = { type: "text"; text: string; bold?: true };

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement | RedElement;
    Text: CustomText;
  }
}

const InitialText: CustomText = {
  type: "text",
  text: "This is the first paragraph!",
};

const RedInitial: RedElement = {
  type: "red",
  children: [InitialText],
};

const InitialElements: CustomElement[] = [
  {
    type: "block",
    children: [RedInitial],
  },
];

const App: React.FC = () => {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState<Descendant[]>(InitialElements);

  const renderElement = useCallback((props: RenderElementProps) => {
    switch (props.element.type) {
      case "red":
        return <Paragraph {...props} />;
      case "block":
        return <DefaultBlock {...props} />;
    }
  }, []);

  console.log(value);

  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <div style={{ width: 700, display: "flex", backgroundColor: '#dedede', borderRadius: 20 }}>
        <Slate
          editor={editor}
          value={value}
          onChange={(value) => setValue(value)}
        >
          <Editable
            style={{ width: "100%" }}
            onKeyDown={(event: React.KeyboardEvent) => {
              if (event.key === "ArrowDown") {
                console.log(editor.selection?.focus.path);
                if (
                  editor.selection?.focus.path[0] ===
                  editor.children.length - 1
                ) {
                  Transforms.insertNodes(
                    editor,
                    { type: "block", children: [] },
                    { at: [editor.children.length] }
                  );
                }
              } else if (event.ctrlKey && event.key === "`") {
                event.preventDefault();
                const [match] = Editor.nodes(editor, {
                  match: (n) => n.type === "red",
                });
                console.log(match);
                Transforms.setNodes(
                  editor,
                  {
                    type: match ? "block" : "red",
                  },
                  {
                    match: (n) => Editor.isBlock(editor, n),
                  }
                );
              } else if (event.ctrlKey && event.key === "m") {
                event.preventDefault();
                const newFancyNode: CustomElement = {
                  type: "block",
                  children: [
                    {
                      type: "red",
                      children: [
                        {
                          type: "text",
                          text: "",
                        },
                      ],
                    },
                  ],
                };
                Editor.insertNode(editor, newFancyNode);
              } else if (event.ctrlKey && event.key === "b") {
                event.preventDefault();
                Editor.insertText(editor, "This is a snippet");
              } else if (event.ctrlKey && event.key === "Enter") {
                event.preventDefault();
                const selection = editor.selection;
                if (selection === null) return;

                const parent = Node.parent(editor, selection.focus.path);
                console.log(parent);

                Editor.insertNode(editor, {
                  type: "block",
                  children: [{ type: "text", text: "new ting" }],
                });
              }
            }}
            renderElement={renderElement}
          />
        </Slate>
      </div>
    </div>
  );
};
export default App;
