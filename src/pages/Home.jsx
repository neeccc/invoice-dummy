import { Link } from 'react-router-dom'
import { platforms } from '../data/registry'

export default function Home() {
  return (
    <div className="home">
      <header className="home-header">
        <h1>Invoice Dummy</h1>
        <p>Sample invoice templates from various platforms</p>
      </header>

      <div className="platform-list">
        {platforms.map((platform) => (
          <div key={platform.id} className="platform-card">
            <div className="platform-card-header" style={{ borderColor: platform.color }}>
              <h2>{platform.name}</h2>
              <span className="platform-name-ja">{platform.nameJa}</span>
              <p className="platform-desc">{platform.description}</p>
            </div>
            <div className="platform-docs">
              {platform.docs.map((doc) => (
                <Link
                  key={doc.key}
                  to={`/${platform.id}/${doc.key}`}
                  className="doc-link"
                  style={{ '--accent': platform.color }}
                >
                  <span className="doc-link-label">{doc.label}</span>
                  <span className="doc-link-desc">{doc.description}</span>
                  <span className="doc-link-arrow">&rarr;</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <footer className="home-footer">
        <p>Add more platforms by extending <code>src/data/registry.js</code></p>
      </footer>
    </div>
  )
}
