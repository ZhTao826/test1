export default {
    methods: {
        handleEscape(e) {
            this.dispatch('ColorPicker', 'on-escape-keydown', e);
        },
    },
};



// WEBPACK FOOTER //
// ./src/components/color-picker/handleEscapeMixin.js