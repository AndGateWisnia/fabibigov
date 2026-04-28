import { useEffect, useState } from "react";

function App() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const newRows = [];
      for (let page = 1; page < 20; page++) {
        try {
          const res = await fetch(`https://api.dane.gov.pl/1.4/resources/1159538/data?per_page=50&page=${page}`);
          const json = await res.json();
          newRows.push(...json.data);
        } catch (err) {
          console.error(err);
        }
      }

      newRows.sort((a, b) => {
        const aValue = a.attributes.col3.val;
        const bValue = b.attributes.col3.val;

        return bValue - aValue;
      });
      setRows(newRows);
    };

    fetchData();
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
