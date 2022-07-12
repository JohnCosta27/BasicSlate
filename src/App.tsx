import React, { useMemo, useCallback, useState } from "react";
import { createEditor, Descendant, Transforms } from "slate";
import { Slate, Editable, withReact, RenderElementProps } from "slate-react";

// This example is for an Editor with `ReactEditor` and `HistoryEditor`
import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";
import DefaultBlock from "./Elements/DefaultBlock";
import Paragraph from "./Elements/Paragraph";

type CustomElement = { type: "block"; children: CustomText[] };
type RedElement = { type: "red"; children: [] };
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

const InitialElements: CustomElement[] = [
  {
    type: "block",
    children: [InitialText],
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
      <div style={{ width: 700, display: "flex" }}>
        <Slate
          editor={editor}
          value={value}
          onChange={(value) => setValue(value)}
        >
          <Editable
            style={{ width: "100%" }}
            onKeyDown={(event: React.KeyboardEvent) => {
              if (event.key === "ArrowDown") {
                if (
                  editor.selection?.focus.path[0] ===
                  editor.children.length - 1
                ) {
                  Transforms.insertNodes(
                    editor,
                    { type: "red", children: [] },
                    { at: [editor.children.length] }
                  );
                }
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
