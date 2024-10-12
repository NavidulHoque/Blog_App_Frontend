export default function autoResizeTextarea(textareaRef) {
    const textarea = textareaRef.current;
    textareaRef.current.style.height = "auto" 

    //after setting auto, scrollHeight will reset
    textarea.style.height = `${textarea.scrollHeight}px`
}