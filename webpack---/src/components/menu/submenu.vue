<template>
    <li :class="classes" @mouseenter="handleMouseenter" @mouseleave="handleMouseleave">
        <div :class="[prefixCls + '-submenu-title']" ref="reference" @click.stop="handleClick" :style="titleStyle">
            <slot name="title"></slot>
            <Icon type="ios-arrow-down" :class="[prefixCls + '-submenu-title-icon']"></Icon>
        </div>
        <collapse-transition v-if="mode === 'vertical'">
            <ul :class="[prefixCls]" v-show="opened"><slot></slot></ul>
        </collapse-transition>
        <transition name="slide-up" v-else>
            <Drop
                v-show="opened"
                placement="bottom"
                ref="drop"
                :style="dropStyle"><ul :class="[prefixCls + '-drop-list']"><slot></slot></ul>
            </Drop>
        </transition>
    </li>
</template>
<script>
    import Drop from '../select/dropdown.vue';
    import Icon from '../icon/icon.vue';
    import CollapseTransition from '../base/collapse-transition';
    import { getStyle, findComponentUpward, findComponentsDownward } from '../../utils/assist';
    import Emitter from '../../mixins/emitter';
    import mixin from './mixin';

    const prefixCls = 'ivu-menu';

    export default {
        name: 'Submenu',
        mixins: [ Emitter, mixin ],
        components: { Icon, Drop, CollapseTransition },
        props: {
            name: {
                type: [String, Number],
                required: true
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                prefixCls: prefixCls,
                active: false,
                opened: false,
                dropWidth: parseFloat(getStyle(this.$el, 'width'))
            };
        },
        computed: {
            classes () {
                return [
                    `${prefixCls}-submenu`,
                    {
                        [`${prefixCls}-item-active`]: this.active && !this.hasParentSubmenu,
                        [`${prefixCls}-opened`]: this.opened,
                        [`${prefixCls}-submenu-disabled`]: this.disabled,
                        [`${prefixCls}-submenu-has-parent-submenu`]: this.hasParentSubmenu,
                        [`${prefixCls}-child-item-active`]: this.active
                    }
                ];
            },
            accordion () {
                return this.menu.accordion;
            },
            dropStyle () {
                let style = {};

                if (this.dropWidth) style.minWidth = `${this.dropWidth}px`;
                return style;
            },
            titleStyle () {
                return this.hasParentSubmenu && this.mode !== 'horizontal' ? {
                    paddingLeft: 43 + (this.parentSubmenuNum - 1) * 24 + 'px'
                } : {};
            }
        },
        methods: {
            handleMouseenter () {
                if (this.disabled) return;
                if (this.mode === 'vertical') return;

                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    this.menu.updateOpenKeys(this.name);
                    this.opened = true;
                }, 250);
            },
            handleMouseleave () {
                if (this.disabled) return;
                if (this.mode === 'vertical') return;

                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    this.menu.updateOpenKeys(this.name);
                    this.opened = false;
                }, 150);
            },
            handleClick () {
                if (this.disabled) return;
                if (this.mode === 'horizontal') return;
                const opened = this.opened;
                if (this.accordion) {
                    this.$parent.$children.forEach(item => {
                        if (item.$options.name === 'Submenu') item.opened = false;
                    });
                }
                this.opened = !opened;
                this.menu.updateOpenKeys(this.name);
            }
        },
        watch: {
            mode (val) {
                if (val === 'horizontal') {
                    this.$refs.drop.update();
                }
            },
            opened (val) {
                if (this.mode === 'vertical') return;
                if (val) {
                    // set drop a width to fixed when menu has fixed position
                    this.dropWidth = parseFloat(getStyle(this.$el, 'width'));
                    this.$refs.drop.update();
                } else {
                    this.$refs.drop.destroy();
                }
            }
        },
        mounted () {
            this.$on('on-menu-item-select', (name) => {
                if (this.mode === 'horizontal') this.opened = false;
                this.dispatch('Menu', 'on-menu-item-select', name);
                return true;
            });
            this.$on('on-update-active-name', (status) => {
                if (findComponentUpward(this, 'Submenu')) this.dispatch('Submenu', 'on-update-active-name', status);
                if (findComponentsDownward(this, 'Submenu')) findComponentsDownward(this, 'Submenu').forEach(item => {
                    item.active = false;
                });
                this.active = status;
            });
        }
    };
</script>



// WEBPACK FOOTER //
// src/components/menu/submenu.vue