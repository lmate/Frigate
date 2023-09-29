import saveIcon from '../assets/save_icon.svg';

function MenuBar({ handleSave, presentationTitle, setPresentationTitle }) {

  function handlePresentationTitleChange(e) {
    setPresentationTitle(e.target.value);
  }

  return (
    <div className="MenuBar">
      <input type="text" placeholder="Title" maxLength={100} defaultValue={presentationTitle} onChange={handlePresentationTitleChange}/>
      <span>Saved</span>
      <div><img src={saveIcon} /></div>
    </div>
  )
}

export default MenuBar;
