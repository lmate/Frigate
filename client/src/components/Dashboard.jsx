import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Header from './Header';
import PresentationList from './PresentationList';
import PresentationPreview from './PresentationPreview';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [selectedPresentationIndex, setSelectedPresentationIndex] = useState(0);

  const navigate = useNavigate();

  // Fetch userData, redirect to auth if login not valid
  useEffect(() => {
    async function fetchUser() {
      const response = await fetch(`/api/user/${localStorage.getItem('id')}`, { method: 'GET', headers: { 'content-type': 'application/json', 'x-access-token': localStorage.getItem('token') } });
      const user = await response.json();

      if (user.invalidToken) {
        console.log(user.msg);
        localStorage.removeItem('token');
        localStorage.removeItem('id');
        return navigate('/auth');
      }
      setUser(user);
    }
    fetchUser();
  }, [navigate]);

  return (
    <>
      {user && (
        <>
          <PresentationPreview presentations={user.presentations} selectedPresentationIndex={selectedPresentationIndex} />
          <Header />
          {console.log(user)}
          <PresentationList presentations={user.presentations} setSelectedPresentationIndex={setSelectedPresentationIndex}/>
        </>
      )}
    </>
  )
}

export default Dashboard;
