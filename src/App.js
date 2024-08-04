import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    zipcode: '',
    item: '',
    role: 'renter'
  });
  const [searchItem, setSearchItem] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [notification, setNotification] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post('http://localhost:5000/api/save', formData);
      setNotification('Submission successful!');
    } catch (error) {
      console.error('Error saving data:', error);
      setNotification('Error saving data. Please try again.');
    }
    setIsSubmitting(false);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/search', {
        params: { zipcode: formData.zipcode, item: searchItem }
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching data:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Rentable</h1>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="renter">Renter</option>
              <option value="lender">Lender</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input name="username" placeholder="Username" onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input name="password" type="password" placeholder="Password" onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input name="email" placeholder="Email" onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input name="phone" placeholder="Phone Number" onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="city">City</label>
            <input name="city" placeholder="City" onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="state">State</label>
            <input name="state" placeholder="State" onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="zipcode">Zipcode (County FIPS)</label>
            <input name="zipcode" placeholder="Zipcode" maxLength="5" onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="item">Item</label>
            <input name="item" placeholder="Item to Rent/Lend" onChange={handleChange} />
          </div>
          <div className="form-group">
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
        {notification && <p>{notification}</p>}
        <div className="search">
          <h2>Search for Items</h2>
          <input
            name="searchItem"
            placeholder="Search for an item"
            value={searchItem}
            onChange={(e) => setSearchItem(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
          {searchResults.length > 0 && (
            <div className="search-results">
              <h3>Search Results:</h3>
              <ul>
                {searchResults.map((result, index) => (
                  <li key={index}>{result.item} - {result.zipcode}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
