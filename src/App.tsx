import React, { useMemo, useCallback, useState } from "react";
import { createEditor, Descendant } from "slate";
import { Slate, Editable, withReact, RenderElementProps } from "slate-react";

// This example is for an Editor with `ReactEditor` and `HistoryEditor`
import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";
import Paragraph from "./Elements/Paragraph";

type CustomElement = { type: "paragraph"; children: CustomText[] };
type CustomText = { text: string; bold?: true };

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

const InitialText: CustomText = {
  text: "This is the first paragraph!",
};

const InitialElements: CustomElement[] = [
  {
    type: "paragraph",
    children: [InitialText],
  },
];

const App: React.FC = () => {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState<Descendant[]>(InitialElements);

  console.log(value);

  const renderElement = useCallback((props: RenderElementProps) => {
    switch (props.element.type) {
      default:
        return <Paragraph {...props} />
    }
  }, []);

  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <div style={{ width: 700, display: "flex" }}>
        <Slate
          editor={editor}
          value={value}
          onChange={(value) => setValue(value)}
        >
          <Editable renderElement={renderElement} />
        </Slate>
      </div>
    </div>
  );
};
export default App;
