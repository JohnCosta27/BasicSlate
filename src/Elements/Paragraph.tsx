import React from "react";
import { RenderElementProps } from "slate-react";

const Paragraph: React.FC<RenderElementProps> = (props: RenderElementProps) => {
  return <p {...props.attributes}>{props.children}</p>;
};
export default Paragraph;
