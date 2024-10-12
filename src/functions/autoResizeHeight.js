//for handling dynamic heights
export default function autoResizeHeight(ref) {
    ref.current.style.height = "auto" 

    //after setting auto, scrollHeight will reset
    ref.current.style.height = `${ref.current.scrollHeight}px`
}