
import React from 'react';
import './style.css';

const getHref = (link) => {
  const item = Array.isArray(link) ? link[0] : link;
  return item?.['@id'] || '#';
};

const extractTOCEntriesInSection = (blockId, blocks, layout) => {
  const startIndex = layout.indexOf(blockId);
  const nextSameBlock = layout.slice(startIndex + 1).find((id) => blocks[id]?.['@type'] === 'buttonRow');
  const endIndex = nextSameBlock ? layout.indexOf(nextSameBlock) : layout.length;
  const targetIds = layout.slice(startIndex + 1, endIndex);

  const entries = [];

  targetIds.forEach((id) => {
    const block = blocks[id];
    if ((block?.['@type'] === 'text' || block?.['@type'] === 'slate') && Array.isArray(block.value)) {
      block.value.forEach((node) => {
        if (['heading-one', 'heading-two', 'heading-three', 'h1', 'h2', 'h3'].includes(node.type)) {
          const text = node.children?.map((c) => c.text).join('').trim();
          const anchor = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          if (text) entries.push({ id: anchor, title: text });
        }
      });
    }
  });

  return entries;
};

const View = ({ data, properties = {}, block }) => {
  const image = data.backgroundImage?.[0];
  const alignment = data.alignment || 'left';
  const imageUrl = image?.['@id'] ? `${image['@id']}/@@images/image` : '';
  const backgroundColor = data.backgroundColor || '#f5f5f5';

  const colorLabelMap = {
    '#000000': 'black',
    '#ffffff': 'white',
    '#f5f5f5': 'light-grey',
    '#ffcc00': 'yellow',
    '#006699': 'blue',
  };

  const colorLabel = (colorLabelMap[backgroundColor] || backgroundColor).replace(/[^a-z0-9]+/gi, '-').toLowerCase();
  const noBg = !imageUrl;
  const darkButtons = noBg && ['#ffffff', '#f5f5f5', '#ffcc00'].includes(backgroundColor);

  const wrapperStyle = {
    backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
    backgroundColor,
  };

  const wrapperClass = `button-row-block ${data.isFullWidth ? 'full-width' : ''} ${noBg ? 'no-bg' : ''} ${darkButtons ? 'dark-buttons' : ''} color-${colorLabel}`;

  const layout = properties.blocks_layout?.items || [];
  const blocks = properties.blocks || {};
  const tocEntries = data.useTOC ? extractTOCEntriesInSection(block, blocks, layout) : [];

  return (
    <div className={wrapperClass} style={wrapperStyle}>
      {imageUrl && <div className="overlay" />}
      <div className={`button-row-inner align-${alignment}`}>
        <div className="button-row-content">
          {data.title && <h1>{data.title}</h1>}
          {data.text && <p>{data.text}</p>}
        </div>

        {data.useTOC ? (
          <div className={`button-row-buttons${data.smallButtons ? ' small-buttons' : ''}`}>
            {tocEntries.map((entry, i) => (
              <a key={i} href={`#${entry.id}`} className="row-button">
                {entry.title}
              </a>
            ))}
          </div>
        ) : (
          data.buttons?.length > 0 && (
            <div className={`button-row-buttons${data.smallButtons ? ' small-buttons' : ''}`}>
              {data.buttons.map((btn, i) => (
                <a key={i} href={getHref(btn.link)} className="row-button">
                  {btn.label}
                </a>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default View;
