
import React from 'react';
import { SidebarPortal, BlockDataForm } from '@plone/volto/components';
import schema from './schema';
import './style.css';

const getHref = (link) => {
  const item = Array.isArray(link) ? link[0] : link;
  return item?.['@id'] || '#';
};

const extractTOCEntries = (blocks, layout = []) => {
  const entries = [];

  layout.forEach((blockId) => {
    const block = blocks[blockId];
    if ((block?.['@type'] === 'text' || block?.['@type'] === 'slate') && Array.isArray(block.value)) {
      block.value.forEach((node) => {
        if (
          ['heading-one', 'heading-two', 'heading-three', 'h1', 'h2', 'h3'].includes(node.type)
        ) {
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

  const startIndex = layout.indexOf(block);
  const nextSameBlock = layout.slice(startIndex + 1).find((id) => blocks[id]?.['@type'] === 'buttonRow');
  const endIndex = nextSameBlock ? layout.indexOf(nextSameBlock) : layout.length;
  const targetIds = layout.slice(startIndex + 1, endIndex);
  const tocEntries = extractTOCEntries(blocks, targetIds);

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
  const darkButtons = noBg && ['#ffffff', '#f5f5f5', '#ffcc00'].includes(backgroundColor);

  const wrapperClass = `button-row-block ${initialisedData.isFullWidth ? 'full-width' : ''} ${
    noBg ? 'no-bg' : ''
  } ${darkButtons ? 'dark-buttons' : ''} color-${colorLabel}`;

  return (
    <>
      <div
        className={wrapperClass}
        style={{
          backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
          backgroundColor,
        }}
      >
        {imageUrl && <div className="overlay" />}
        <div className={`button-row-inner align-${initialisedData.alignment || 'left'}`}>
          <div className="button-row-content">
            {initialisedData.title && <h1>{initialisedData.title}</h1>}
            {initialisedData.text && <p>{initialisedData.text}</p>}
          </div>

          {useTOC ? (
            <div className={`button-row-buttons${initialisedData.smallButtons ? ' small-buttons' : ''}`}>
              {tocEntries.map((entry, i) => (
                <a key={i} href={`#${entry.id}`} className="row-button">
                  {entry.title}
                </a>
              ))}
            </div>
          ) : (
            initialisedData.buttons?.length > 0 && (
              <div className={`button-row-buttons${initialisedData.smallButtons ? ' small-buttons' : ''}`}>
                {initialisedData.buttons.map((btn, i) => (
                  <a key={i} href={getHref(btn.link)} className="row-button">
                    {btn.label}
                  </a>
                ))}
              </div>
            )
          )}
        </div>
      </div>

      {selected && (
        <SidebarPortal selected={selected}>
          <BlockDataForm
            schema={{
              ...schema(props),
              fieldsets: schema(props).fieldsets.map((fs) => {
                let fields = fs.fields;
                if (imageUrl) fields = fields.filter((f) => f !== 'backgroundColor');
                
                return { ...fs, fields };
              }),
            }}
            title="Button Row Block"
            onChangeField={(id, value) =>
              onChangeBlock(block, { ...data, [id]: value })
            }
            onChangeBlock={(id, newData) =>
              onChangeBlock(id, {
                ...data,
                ...newData,
                backgroundColor: newData.backgroundImage ? undefined : initialisedData.backgroundColor,
              })
            }
            block={block}
            formData={initialisedData}
          />
        </SidebarPortal>
      )}
    </>
  );
};

export default Edit;
