To register ButtonRow block, add to src/index.js

import cardsSVG from '@plone/volto/icons/cards.svg';
import { Edit as ButtonRowEdit, View as ButtonRowView } from './components/Blocks/ButtonRow';

const applyConfig = (config) => {

  //ButtonRow
  config.blocks.blocksConfig.buttonRow = {
    id: 'buttonRow',
    title: 'Button Row',
    icon: cardsSVG,
    group: 'common',
    view: ButtonRowView,
    edit: ButtonRowEdit,
    restricted: false,
    mostUsed: true,
    sidebarTab: 1,
  };

  return config;
};