import { useState, useEffect, useRef } from 'react';
import './App.css';
import axios from 'axios';

const apiURL = 'http://localhost/react-php/backend/index.php?action=';

function App() {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [insertModal, setInsertModal] = useState(false);
  const [currentUser, setCurrentUser] = useState([]);
  const [formData, setFormData] = useState([])
  const user = useRef([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${apiURL}fetch`);
      user.current = res.data;
      setUsers(user.current);
      console.log(`Users: ${user.current}`);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const del = async (id) => {
    try {
      const res = await axios.delete(`${apiURL}delete`, { data: { uuid: id } });
      if (res.data.type === 'success') {
        alert(res.data.message);
        fetchData();
      } else if (res.data.type === 'error') {
        alert(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const openUpdateModal = (user) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const openInsertModal = () => {
    setInsertModal(true);
    setFormData([]);
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleInsertChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${apiURL}update`, currentUser);
      console.log(currentUser)
      if (res.data.type === 'success') {
        alert(res.data.message);
        setIsModalOpen(false);
        fetchData();
      } else if (res.data.type === 'error') {
        alert(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleInsertSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${apiURL}insert`, formData);
      console.log(formData)
      if (res.data.type === 'success') {
        alert(res.data.message);
        setInsertModal(false);
        fetchData();
      } else if (res.data.type === 'error') {
        alert(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Users List</h1>
      <button onClick={() => openInsertModal()}>Insert</button>
      <table>
        <thead>
          <tr>
            <th>UID</th>
            <th>Name</th>
            <th>Contact Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user, index) => (
              <tr key={index}>
                <td>{user.uid}</td>
                <td>{user.uname}</td>
                <td>{user.ucontact}</td>
                <td>
                  <button onClick={() => openUpdateModal(user)}>Update</button>
                  <button onClick={() => del(user.uid)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No data found!</td>
            </tr>
          )}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Update User</h2>
            <form onSubmit={handleUpdateSubmit}>
              <label>Name:</label>
              <input
                type="text"
                name="uname"
                value={currentUser.uname}
                onChange={handleUpdateChange}
                required
              />
              <label>Contact Number:</label>
              <input
                type="text"
                name="ucontact"
                value={currentUser.ucontact}
                onChange={handleUpdateChange}
                required
              />
              <div className="modal-actions">
                <button type="submit">Update</button>
                <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {insertModal && (
            <div className="modal">
              <div className="modal-content">
                <h2>Insert New User</h2>
                <form onSubmit={handleInsertSubmit}>
                  <label>Name:</label>
                  <input
                    type="text"
                    name="uname"
                    placeholder='Enter name...'
                    value={formData.uname}
                    onChange={handleInsertChange}
                    required
                  />
                  <label>Contact Number:</label>
                  <input
                    type="text"
                    name="ucontact"
                    placeholder='Enter contact number...'
                    value={formData.ucontact}
                    onChange={handleInsertChange}
                    required
                  />
                  <div className="modal-actions">
                    <button type="submit">Insert</button>
                    <button type="button" onClick={() => setInsertModal(false)}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}
      </div>
  );
}

export default App;

