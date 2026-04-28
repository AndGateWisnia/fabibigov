import { useEffect, useState } from "react";

function App() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    for (let page = 1; page < 20; page++) {
      fetch(`https://api.dane.gov.pl/1.4/resources/1159538/data?per_page=50&page=${page}`)
        .then(res => res.json())
        .then(json => {
          setRows(prev => [...prev, ...json.data]);
        })
        .catch(err => console.error(err));
    }
  }, []);

  return (
    <div>
      <h1>Users</h1>

      {rows.length === 0 && <p>Loading...</p>}

      {rows.map((row, i) => (
        <div key={i}>
          <p>Imię: {row.attributes.col1.val}</p>
          <p>Wystąpienia: {row.attributes.col3.val}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
