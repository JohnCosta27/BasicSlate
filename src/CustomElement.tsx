const CustomElement = (props) => {
  return (
    <div style={{backgroundColor: 'red'}}>
    {props.children}
    </div>
  )
};
export default CustomElement;
