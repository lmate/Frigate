import saveIcon from '../assets/save_icon.svg';
import loadIcon from '../assets/load_icon.svg';

function MenuBar({ handleSave, presentationTitle, setPresentationTitle, isSaved, isInSavingProcess }) {

  function handlePresentationTitleChange(e) {
    setPresentationTitle(e.target.value);
  }

  return (
    <>
      {isSaved !== null && (
        <div className="MenuBar">
          <input type="text" placeholder="Title" maxLength={100} defaultValue={presentationTitle} onChange={handlePresentationTitleChange} />
          {isSaved && (<span>Saved</span>)}
          <div onClick={handleSave}>
            <img src={saveIcon} className={isInSavingProcess ? 'displayNone' : ''} style={isSaved ? { filter: 'invert(51%) sepia(16%) saturate(190%) hue-rotate(172deg) brightness(98%) contrast(91%)' } : { filter: 'invert(23%) sepia(93%) saturate(2345%) hue-rotate(210deg) brightness(95%) contrast(96%)' }} />
            <img src={loadIcon} className={!isInSavingProcess ? 'displayNone loadIcon' : 'loadIcon'} />
          </div>
        </div>
      )}
    </>
  )
}

export default MenuBar;
