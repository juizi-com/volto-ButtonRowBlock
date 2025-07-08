import React from 'react';
import { SidebarPortal, BlockDataForm } from '@plone/volto/components';
import schema from './schema';
import './style.css';

const getHref = (link) => {
  const item = Array.isArray(link) ? link[0] : link;
  if (!item) return '#';
  const url = item['@id'] || '#';
  const isFile = item['@type'] === 'File';
  return isFile ? `${url}/@@download/file` : url;
};

const extractTOCEntries = (blocks, layout = [], data = {}) => {
  const allowH2 = data.useH2 ?? true;
  const allowH3 = data.useH3 ?? true;
  const allowedTypes = [
    ...(allowH2 ? ['heading-two', 'h2'] : []),
    ...(allowH3 ? ['heading-three', 'h3'] : []),
  ];

  const entries = [];

  layout.forEach((blockId) => {
    const block = blocks[blockId];
    if (
      (block?.['@type'] === 'text' || block?.['@type'] === 'slate') &&
      Array.isArray(block.value)
    ) {
      block.value.forEach((node) => {
        if (allowedTypes.includes(node.type)) {
          const text = node.children?.map((child) => child.text).join('').trim();
          const anchor = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          if (text) {
            entries.push({ id: anchor, title: text });
          }
        }
      });
    }
  });

  return entries;
};

const Edit = (props) => {
  const { data, block, onChangeBlock, selected } = props;
  const initialisedData = data;
  const blocks = props?.properties?.blocks || {};
  const layout = props?.properties?.blocks_layout?.items || [];

  const useTOC = initialisedData.useTOC === true;
  const displayAsList = initialisedData.displayAsList === true;

  const startIndex = layout.indexOf(block);
  const nextSameBlock = layout
    .slice(startIndex + 1)
    .find((id) => blocks[id]?.['@type'] === 'buttonRow');
  const endIndex = nextSameBlock
    ? layout.indexOf(nextSameBlock)
    : layout.length;
  const targetIds = layout.slice(startIndex + 1, endIndex);
  const tocEntries = extractTOCEntries(blocks, targetIds, data);

  const imageItem = Array.isArray(initialisedData.backgroundImage)
    ? initialisedData.backgroundImage[0]
    : initialisedData.backgroundImage;

  const imageUrl = imageItem?.['@id']
    ? `${imageItem['@id']}/@@images/image`
    : imageItem?.download || '';

  const backgroundColor = initialisedData.backgroundColor || '#f5f5f5';
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

  const wrapperClass = displayAsList ? 'button-row-list-mode' : `button-row-block ${initialisedData.isFullWidth ? 'full-width' : ''} ${
    noBg ? 'no-bg' : ''
  } ${darkButtons ? 'dark-buttons' : ''} color-${colorLabel}`;

  return (
    <>
      <div
        className={wrapperClass}
        style={displayAsList ? {} : {
          backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
          backgroundColor,
        }}
      >
        {!displayAsList && imageUrl && <div className="overlay" />}
        <div
          className={displayAsList ? '' : `button-row-inner align-${initialisedData.alignment || 'left'}`}
        >
          <div className="button-row-content">
            {initialisedData.title && <h1>{initialisedData.title}</h1>}
            {initialisedData.text && <p>{initialisedData.text}</p>}
          </div>

          {useTOC ? (
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
                className={`button-row-buttons${initialisedData.smallButtons ? ' small-buttons' : ''}`}
              >
                {tocEntries.map((entry, i) => (
                  <a key={i} href={`#${entry.id}`} className="row-button">
                    {entry.title}
                  </a>
                ))}
              </div>
            )
          ) : (
            initialisedData.buttons?.length > 0 && (
              displayAsList ? (
                <div className="button-row-list">
                  <p>
                    {initialisedData.buttons.map((btn, i) => (
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
                        {i < initialisedData.buttons.length - 1 && ' | '}
                      </React.Fragment>
                    ))}
                  </p>
                </div>
              ) : (
                <div
                  className={`button-row-buttons${initialisedData.smallButtons ? ' small-buttons' : ''}`}
                >
                  {initialisedData.buttons.map((btn, i) => (
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

      {selected && (
        <SidebarPortal selected={selected}>
          <BlockDataForm
            schema={schema(props)}
            title="Button Row Block"
            onChangeField={(id, value) =>
              onChangeBlock(block, { ...data, [id]: value })
            }
            onChangeBlock={onChangeBlock}
            block={block}
            formData={data}
          />
        </SidebarPortal>
      )}
    </>
  );
};

export default Edit;