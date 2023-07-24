const HandleColorPick = (event) => {
    const clickedElement = document.elementFromPoint(event.clientX, event.clientY);
    if (clickedElement) {
      const computedStyle = window.getComputedStyle(clickedElement);
      const backgroundColor = computedStyle.backgroundColor;
      return backgroundColor;
    }
    return null;
  }

  export default HandleColorPick;