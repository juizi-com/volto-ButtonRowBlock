const schema = () => {
  return {
    title: 'Button Row Block',
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: [
          'title',
          'text',
          'backgroundColor',
          'backgroundImage',
          'isFullWidth',
          'alignment',
          'useTOC',
          'useH2',
          'useH3',
          'displayAsList',
          'smallButtons',
          'buttons',
        ],
      },
    ],
    properties: {
      title: {
        title: 'Title',
        type: 'string',
      },
      text: {
        title: 'Text',
        type: 'string',
        widget: 'textarea',
      },
      backgroundColor: {
        title: 'Background colour',
        widget: 'select',
        choices: [
          ['var(--charcoal)', 'Charcoal'],
          ['#ffffff', 'White'],
          ['var(--lightgrey)', 'Light grey'],
          ['var(--turquoise)', 'Turquoise'],
          ['var(--darkturquoise)', 'Dark Turquoise'],
          ['var(--red)', 'Red'],
        ],
        default: '#f5f5f5',
      },
      backgroundImage: {
        title: 'Background image',
        widget: 'object_browser',
        mode: 'image',
        allowExternals: false,
      },
      isFullWidth: {
        title: 'Full width background',
        type: 'boolean',
        default: false,
      },
      alignment: {
        title: 'Text alignment',
        widget: 'align',
        actions: ['left', 'center', 'right'],
        default: 'left',
      },
      useTOC: {
        title: 'Use TOC instead of buttons',
        type: 'boolean',
        default: false,
      },
      useH2: {
        title: 'Include H2 headings in TOC',
        type: 'boolean',
        default: true,
      },
      useH3: {
        title: 'Include H3 headings in TOC',
        type: 'boolean',
        default: true,
      },
      displayAsList: {
        title: 'Display buttons as simple list',
        type: 'boolean',
        default: false,
      },
      smallButtons: {
        title: 'Use smaller buttons',
        type: 'boolean',
        default: false,
      },
      buttons: {
        title: 'Buttons',
        widget: 'object_list',
        schema: {
          title: 'Button',
          fieldsets: [
            {
              id: 'default',
              title: 'Default',
              fields: ['label', 'link'],
            },
          ],
          properties: {
            label: {
              title: 'Label',
              type: 'string',
            },
            link: {
              title: 'Link',
              widget: 'object_browser',
              mode: 'link',
              allowExternals: true,
              multi: false,
              default: null,
            },
          },
        },
      },
    },
    required: [],
  };
};

export default schema;