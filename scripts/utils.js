export function getContentSize(node) {
  const computedStyles = getComputedStyle(node);
  return {
    width:
      node.clientWidth -
      parseInt(computedStyles.paddingLeft) -
      parseInt(computedStyles.paddingRight),
    height:
      node.clientHeight -
      parseInt(computedStyles.paddingTop) -
      parseInt(computedStyles.paddingBottom),
  };
}
