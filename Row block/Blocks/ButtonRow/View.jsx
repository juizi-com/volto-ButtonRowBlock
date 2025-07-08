import React from 'react';
import './style.css';

const getHref = (link) => {
  const item = Array.isArray(link) ? link[0] : link;
  if (!item) return '#';
  const url = item['@id'] || '#';
  const isFile = item['@type'] === 'File';
  return isFile ? `${url}/@@download/file` : url;
};

const extractTOCEntriesInSection = (blockId, blocks, layout, data = {}) => {
  const allowH2 = data.useH2 ?? true;
  const allowH3 = data.useH3 ?? true;
  const allowedTypes = [
    ...(allowH2 ? ['heading-two', 'h2'] : []),
    ...(allowH3 ? ['heading-three', 'h3'] : []),
  ];

  const startIndex = layout.indexOf(blockId);
  const nextSameBlock = layout
    .slice(startIndex + 1)
    .find((id) => blocks[id]?.['@type'] === 'buttonRow');
  const endIndex = nextSameBlock
    ? layout.indexOf(nextSameBlock)
    : layout.length;
  const targetIds = layout.slice(startIndex + 1, endIndex);

  const entries = [];

  targetIds.forEach((id) => {
    const block = blocks[id];
    if (
      (block?.['@type'] === 'text' || block?.['@type'] === 'slate') &&
      Array.isArray(block.value)
    ) {
      block.value.forEach((node) => {
        if (allowedTypes.includes(node.type)) {
          const text = node.children?.map((c) => c.text).join('').trim();
          const anchor = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          if (text) entries.push({ id: anchor, title: text });
        }
      });
    }
  });

  return entries;
};

const View = ({ data = {}, properties = {}, block }) => {
  const image = data.backgroundImage?.[0];
  const alignment = data.alignment || 'left';
  const imageUrl = image?.['@id'] ? `${image['@id']}/@@images/image` : '';
  const backgroundColor = data.backgroundColor || '#f5f5f5';
  const displayAsList = data.displayAsList === true;

  const colorLabelMap = {
    '#000000': 'black',
    '#ffffff': 'white',
    '#f5f5f5': 'light-grey',
    '#ffcc00': 'yellow',
    '#006699': 'blue',
  };

  const colorLabel = (colorLabelMap[backgroundColor] || backgroundColor)
    .replace(/[^a-z0-9]+/gi, '-')
    .toLowerCase();
  const noBg = !imageUrl;
  const darkButtons =
    noBg && ['#ffffff', '#f5f5f5', '#ffcc00'].includes(backgroundColor);

  const wrapperStyle = displayAsList ? {} : {
    backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
    backgroundColor,
  };

  const wrapperClass = displayAsList ? 'button-row-list-mode' : `button-row-block ${data.isFullWidth ? 'full-width' : ''} ${noBg ? 'no-bg' : ''} ${darkButtons ? 'dark-buttons' : ''} color-${colorLabel}`;

  const layout = properties.blocks_layout?.items || [];
  const blocks = properties.blocks || {};
  const tocEntries = data.useTOC ? extractTOCEntriesInSection(block, blocks, layout, data) : [];

  return (
    <div className={wrapperClass} style={wrapperStyle}>
      {!displayAsList && imageUrl && <div className="overlay" />}
      <div className={displayAsList ? '' : `button-row-inner align-${alignment}`}>
        <div className="button-row-content">
          {data.title && <h1>{data.title}</h1>}
          {data.text && <p>{data.text}</p>}
        </div>

        {data.useTOC ? (
          displayAsList ? (
            <div className="button-row-list">
              <p>
                {tocEntries.map((entry, i) => (
                  <React.Fragment key={i}>
                    <a href={`#${entry.id}`}>{entry.title}</a>
                    {i < tocEntries.length - 1 && ' | '}
                  </React.Fragment>
                ))}
              </p>
            </div>
          ) : (
            <div
              className={`button-row-buttons${data.smallButtons ? ' small-buttons' : ''}`}
            >
              {tocEntries.map((entry, i) => (
                <a key={i} href={`#${entry.id}`} className="row-button">
                  {entry.title}
                </a>
              ))}
            </div>
          )
        ) : (
          data.buttons?.length > 0 && (
            displayAsList ? (
              <div className="button-row-list">
                <p>
                  {data.buttons.map((btn, i) => (
                    <React.Fragment key={i}>
                      {(() => {
                        const href = getHref(btn.link);
                        const isExternal = href?.startsWith('http');
                        return (
                          <a
                            href={href}
                            {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                          >
                            {btn.label}
                          </a>
                        );
                      })()}
                      {i < data.buttons.length - 1 && ' | '}
                    </React.Fragment>
                  ))}
                </p>
              </div>
            ) : (
              <div
                className={`button-row-buttons${data.smallButtons ? ' small-buttons' : ''}`}
              >
                {data.buttons.map((btn, i) => (
                  (() => {
    const href = getHref(btn.link);
    const isExternal = href?.startsWith('http');
    return (
      <a
        key={i}
        href={href}
        className="row-button"
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {btn.label}
      </a>
    );
  })()
                ))}
              </div>
            )
          )
        )}
      </div>
    </div>
  );
};

export default View;