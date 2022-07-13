import React from "react";
import { RenderElementProps } from "slate-react";

const DefaultBlock: React.FC<RenderElementProps> = (props: RenderElementProps) => {
  return (
    <div
      {...props.attributes}
      style={{
        width: "100%",
        padding: 8,
        borderRadius: 10,
        backgroundColor: "#dedede",
        marginTop: 10,
        marginBottom: 10,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {props.children}
    </div>
  );
};
export default DefaultBlock;
