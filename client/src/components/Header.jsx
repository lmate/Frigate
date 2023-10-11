import { useNavigate } from "react-router-dom";

function Header({ user }) {

  const navigate = useNavigate();

  async function handleCreatePresentation() {
    const response = await fetch(`/api/user/${localStorage.getItem('id')}/presentation`, { method: 'POST', headers: { 'content-type': 'application/json', 'x-access-token': localStorage.getItem('token') }, body: JSON.stringify({}) });
    const presentation = await response.json();
    navigate(`/present/edit/${presentation._id}`, {state: {presentation: {...presentation, data: JSON.parse(presentation.data)}, sentAt: Date.now()}});
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    navigate('/auth');
  }

  return (
    <div className="Header">
      <button onClick={handleCreatePresentation}>+</button>
      <span>{user.name}</span>
      <span onClick={handleLogout}><u>Log out</u></span>
    </div>
  )
}

export default Header;
