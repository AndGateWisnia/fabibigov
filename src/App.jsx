import { useEffect, useState, useRef } from "react";
import SearchBar from "./SearchBar";

function App({ ids, sexLetter, type }) {
  const [rows, setRows] = useState([]);
  const [filtr, setFiltr] = useState("");
  const [wystReverse, setWystReverse] = useState(false);
  const [occurReverse, setOccurReverse] = useState(false);
  const hashmapRef = useRef(new Map());

  useEffect(() => {
    const fetchData = async () => {
      const cacheKey = `data-cache-${ids.join(",")}-${sexLetter}`;
      const cacheTTL = 1000 * 60 * 60 * 48; // 48h
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
  
        if (Date.now() - parsed.timestamp < cacheTTL) {
          setRows(parsed.data);
          const hashmap = hashmapRef.current;
          return; // użyj cache i NIE fetchuj
        }
      }
      const hashmap = hashmapRef.current;

      for (const id of ids) {
        let page = 1;

        while (true) {
          try {
            const res = await fetch(`https://api.dane.gov.pl/1.4/resources/${id}/data?per_page=50&page=${page}`);
            const json = await res.json();
            if (!json.data || json.data.length === 0) break;
            if (type == "imie"){
              for (const row of json.data) {
                const key = row.attributes.col1.val;
                const value = row.attributes.col3.val;
                hashmap.set(key, (hashmap.get(key) || 0) + value);
              }
            else{
              for (const row of json.data) {
                const key = row.attributes.col1.val;
                const value = row.attributes.col2.val;
                hashmap.set(key, (hashmap.get(key) || 0) + value);
              }
            }
            page++;
          } catch (err) {
            console.error(err);
            break;
          }
        }

        page = 1;

        if (type == "imie"){
          while (true) {
            try {
              const res = await fetch(`https://api.dane.gov.pl/1.4/resources/21458/data?per_page=50&page=${page}`);
              const json = await res.json();
              if (!json.data || json.data.length === 0) break;
  
              for (const row of json.data) {
                const key = row.attributes.col2.val;
                const value = row.attributes.col3.val;
  
                if (row.attributes.col4.val === sexLetter) {
                  hashmap.set(key, (hashmap.get(key) || 0) + value);
                }
              }
              page++;
            } catch (err) {
              console.error(err);
              break;
            }
          }
        }
      }

      const sorted = Array.from(hashmap.entries()).sort((a, b) => b[1] - a[1]);
      setRows(sorted);

      localStorage.setItem(
      cacheKey,
      JSON.stringify({
          data: sorted,
          timestamp: Date.now()
        })
      );
    };

    fetchData();
  }, [ids, sexLetter]);

  function sortByOccurences() {
    const sorted = [...rows].sort((a, b) =>
      occurReverse ? a[1] - b[1] : b[1] - a[1]
    );
    setRows(sorted);
    setOccurReverse(prev => !prev);
    setWystReverse(false);
  }

  function normalize(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

  function sortByName() {
    const sorted = [...rows].sort((a, b) => {
      const aValue = normalize(a[0]);
      const bValue = normalize(b[0]);

      return wystReverse
        ? bValue.localeCompare(aValue)
        : aValue.localeCompare(bValue);
    });

    setRows(sorted);
    setWystReverse(prev => !prev);
    setOccurReverse(false);
  }

  return (<>
    <SearchBar filtr={filtr} setFiltr={setFiltr} />
    <table className="table table-striped">
        {rows.length !== 0 && (
          <thead className="table-primary">
            <tr>
              <th onClick={sortByName}>Imie</th>
              <th onClick={sortByOccurences}>Wystapienia</th>
            </tr>
          </thead>
        )}

        <tbody>
          {rows.map((row, i) => (
            (filtr === "" ||
              row[0].toLowerCase().startsWith(filtr.toLowerCase())) && (
              <tr key={i}>
                <td>{row[0]}</td>
                <td>{row[1]}</td>
              </tr>
            )
          ))}
        </tbody>
      </table>
    </>
  );
}

export default App;
