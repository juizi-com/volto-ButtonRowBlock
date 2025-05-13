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
          ['#000000', 'Black'],
          ['#ffffff', 'White'],
          ['#f5f5f5', 'Light grey'],
          ['#cccccc', 'Dark grey'],
          ['#ffcc00', 'Yellow'],
          ['#006699', 'Blue'],
        ],
        default: '#f5f5f5',
        requiresDarkButtons: ['#ffffff', '#f5f5f5', '#ffcc00'],
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
              allowExternals: false,
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
