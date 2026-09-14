import { site } from '@/lib/data/site';

export function WhoamiCard() {
  return (
    <div className="term">
      <div className="term__bar">
        <span className="term__dots">
          <i />
          <i />
          <i />
        </span>
        <span className="term__title">whoami.json</span>
      </div>
      <div className="term__body term__body--out">
        <p className="term__line">
          <span className="term__prompt">$</span> cat whoami.json
        </p>
        <pre className="term__json">
          {'{\n'}
          {'  '}
          <span className="term__jk">&quot;name&quot;</span>
          {': '}
          <span className="term__jv">&quot;{site.name}&quot;</span>
          {',\n  '}
          <span className="term__jk">&quot;role&quot;</span>
          {': '}
          <span className="term__jv">&quot;{site.role}&quot;</span>
          {',\n  '}
          <span className="term__jk">&quot;location&quot;</span>
          {': '}
          <span className="term__jv">&quot;{site.location}&quot;</span>
          {',\n  '}
          <span className="term__jk">&quot;email&quot;</span>
          {': '}
          <span className="term__jv">
            &quot;
            <a href={`mailto:${site.email}`}>{site.email}</a>
            &quot;
          </span>
          {',\n  '}
          <span className="term__jk">&quot;phone&quot;</span>
          {': '}
          <span className="term__jv">
            &quot;
            <a href={`tel:${site.phoneHref}`}>{site.phone}</a>
            &quot;
          </span>
          {',\n  '}
          <span className="term__jk">&quot;whatsapp&quot;</span>
          {': '}
          <span className="term__jv">
            &quot;
            <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener">
              {site.phone}
            </a>
            &quot;
          </span>
          {',\n  '}
          <span className="term__jk">&quot;github&quot;</span>
          {': '}
          <span className="term__jv">
            &quot;
            <a href={site.github} target="_blank" rel="noopener">
              {site.githubHandle}
            </a>
            &quot;
          </span>
          {',\n  '}
          <span className="term__jk">&quot;linkedin&quot;</span>
          {': '}
          <span className="term__jv">
            &quot;
            <a href={site.linkedin} target="_blank" rel="noopener">
              {site.linkedinHandle}
            </a>
            &quot;
          </span>
          {',\n  '}
          <span className="term__jk">&quot;status&quot;</span>
          {': '}
          <span className="term__jv">&quot;{site.availability}&quot;</span>
          {'\n}'}
        </pre>
      </div>
    </div>
  );
}
