import Chat from "./Chat";
import MenuBar from "./MenuBar";
import SlideEditor from "./SlideEditor";
import SlideStrip from "./SlideStrip";
import ToolBar from "./ToolBar";

function Editor() {
  return (
    <>
      <SlideStrip />
      <Chat />
      <MenuBar />
      <SlideEditor />
      <ToolBar />
    </>
  )
}

export default Editor;
