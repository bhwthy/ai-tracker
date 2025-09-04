import React, { useState } from 'react';

function App() {
  const [keywords, setKeywords] = useState(['']);
  const [template, setTemplate] = useState('best *keyword* in *city*');
  const [keywordInput, setKeywordInput] = useState('dentist');
  const [cityInput, setCityInput] = useState('Phoenix');
  const [domains, setDomains] = useState(['']);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleKeywordChange = (idx, value) => {
    const newKeywords = [...keywords];
    newKeywords[idx] = value;
    setKeywords(newKeywords);
  };

  const handleTemplateChange = (e) => setTemplate(e.target.value);
  const handleKeywordInputChange = (e) => setKeywordInput(e.target.value);
  const handleCityInputChange = (e) => setCityInput(e.target.value);

  const generateKeywords = () => {
    const kw = template.replace('*keyword*', keywordInput).replace('*city*', cityInput);
    setKeywords([kw]);
  };

  const handleDomainChange = (idx, value) => {
    const newDomains = [...domains];
    newDomains[idx] = value;
    setDomains(newDomains);
  };

  const addKeyword = () => setKeywords([...keywords, '']);
  const addDomain = () => setDomains([...domains, '']);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await fetch('http://localhost:5000/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keywords, domains })
    });
    const data = await response.json();
    setResults(data.results);
    setLoading(false);
  };

  return (
    <div style={{ padding: 32, fontFamily: 'Arial, sans-serif', background: '#f9f9f9', minHeight: '100vh' }}>
      <h1 style={{ color: '#2d6cdf' }}>AI Search Tracker</h1>
      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: 24, borderRadius: 8, boxShadow: '0 2px 8px #eee', marginBottom: 32 }}>
        <h2 style={{ color: '#444' }}>Keyword Template</h2>
        <input value={template} onChange={handleTemplateChange} style={{ marginBottom: 8, width: 300, padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
        <div style={{ marginBottom: 8 }}>
          <input value={keywordInput} onChange={handleKeywordInputChange} placeholder="Keyword (e.g. dentist)" style={{ marginRight: 8, width: 140, padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
          <input value={cityInput} onChange={handleCityInputChange} placeholder="City (e.g. Phoenix)" style={{ width: 140, padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
          <button type="button" onClick={generateKeywords} style={{ marginLeft: 8, padding: '4px 12px', borderRadius: 4, background: '#2d6cdf', color: '#fff', border: 'none' }}>Generate Keyword</button>
        </div>
        <h2 style={{ color: '#444' }}>Keywords</h2>
        {keywords.map((kw, idx) => (
          <input key={idx} value={kw} onChange={e => handleKeywordChange(idx, e.target.value)} placeholder="Keyword" style={{ marginBottom: 8, width: 300, padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
        ))}
        <button type="button" onClick={addKeyword} style={{ marginLeft: 8, padding: '4px 12px', borderRadius: 4, background: '#e3e3e3', border: 'none' }}>Add Keyword</button>
        <h2 style={{ color: '#444', marginTop: 24 }}>Client Domains</h2>
        {domains.map((dm, idx) => (
          <input key={idx} value={dm} onChange={e => handleDomainChange(idx, e.target.value)} placeholder="Domain" style={{ marginBottom: 8, width: 300, padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
        ))}
        <button type="button" onClick={addDomain} style={{ marginLeft: 8, padding: '4px 12px', borderRadius: 4, background: '#e3e3e3', border: 'none' }}>Add Domain</button>
        <br /><br />
        <button type="submit" disabled={loading} style={{ padding: '8px 24px', borderRadius: 4, background: '#2d6cdf', color: '#fff', border: 'none', fontWeight: 'bold' }}>{loading ? 'Searching...' : 'Search'}</button>
      </form>
      <div style={{ marginTop: 32 }}>
        <h2 style={{ color: '#2d6cdf' }}>Results</h2>
        {results.length === 0 ? <p>No results yet.</p> : (
          results.map((res, idx) => (
            <div key={idx} style={{ marginBottom: 32, borderBottom: '2px solid #e3e3e3', paddingBottom: 20, background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px #eee' }}>
              <div style={{ marginBottom: 8 }}>
                <strong>Keyword:</strong> <span style={{ color: '#2d6cdf' }}>{res.keyword}</span>
              </div>
              <div style={{ marginBottom: 8 }}>
                <strong>Engine:</strong> <span style={{ color: res.engine === 'perplexity' ? '#ff9800' : '#2d6cdf', fontWeight: 'bold', padding: '2px 8px', borderRadius: 4, background: res.engine === 'perplexity' ? '#fff3e0' : '#e3f0ff' }}>{res.engine === 'perplexity' ? 'Perplexity' : res.engine}</span>
              </div>
              <div style={{ marginBottom: 8 }}>
                <strong>Domain Found:</strong> {res.domain_found ? <span style={{ color: 'green', fontWeight: 'bold' }}>Yes</span> : <span style={{ color: 'red', fontWeight: 'bold' }}>No</span>}
              </div>
              {res.domain_found ? (
                <div style={{ marginBottom: 8 }}><strong>Position:</strong> <span style={{ color: '#2d6cdf', fontWeight: 'bold' }}>{res.position}</span></div>
              ) : (
                <div style={{ marginBottom: 8 }}><span style={{ color: 'red', fontWeight: 'bold' }}>Your domain was NOT found in the top results.</span></div>
              )}
              {res.search_results && Array.isArray(res.search_results) && (
                <div style={{ marginTop: 12 }}>
                  <strong>Top Results:</strong>
                  <ol style={{ marginTop: 8, paddingLeft: 20 }}>
                    {res.search_results.map((r, i) => (
                      <li key={i} style={{ marginBottom: 6 }}>
                        <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ color: '#2d6cdf', textDecoration: 'underline', fontWeight: 'bold' }}>{r.title || r.url}</a>
                        {r.url && <span style={{ color: '#888', marginLeft: 8 }}>{r.url}</span>}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
