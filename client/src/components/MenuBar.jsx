function MenuBar({ handleSave, presentationTitle, setPresentationTitle }) {

  function handlePresentationTitleChange(e) {
    setPresentationTitle(e.target.value);
  }

  return (
    <div className="MenuBar">
      <input type="text" placeholder="Title" defaultValue={presentationTitle} onChange={handlePresentationTitleChange}/>
    </div>
  )
}

export default MenuBar;
