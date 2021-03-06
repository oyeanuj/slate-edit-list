const React = require('react');
const ReactDOM = require('react-dom');
const Slate = require('slate');
const yaml = require('yaml-js');

const PluginEditList = require('../lib/');

const stateJson = yaml.load(require('./state.yaml'));

const plugin = PluginEditList();
const plugins = [plugin];

const SCHEMA = {
    nodes: {
        ul_list:   props => <ul {...props.attributes}>{props.children}</ul>,
        ol_list:   props => <ol {...props.attributes}>{props.children}</ol>,

        list_item: (props) => {
            const { node, state } = props;
            const isCurrentItem = node === plugin.utils.getCurrentItem(state);

            return (
                <li className={isCurrentItem ? 'current-item' : ''}
                    title={isCurrentItem ? 'Current Item' : ''}
                    {...props.attributes}>
                    {props.children}
                </li>
            );
        },

        paragraph: props => <p {...props.attributes}>{props.children}</p>,
        heading:   props => <h1 {...props.attributes}>{props.children}</h1>
    }
};

const Example = React.createClass({
    getInitialState() {
        return {
            state: Slate.Raw.deserialize(stateJson, { terse: true })
        };
    },

    onChange(state) {
        this.setState({
            state
        });
    },

    call(transform) {
        this.setState({
            state: this.state.state.transform().call(transform).apply()
        });
    },

    renderToolbar() {
        const { wrapInList, unwrapList } = plugin.transforms;
        return (
            <div>
                <button onClick={() => this.call(wrapInList)}>Wrap in list</button>
                <button onClick={() => this.call(unwrapList)}>Unwrap from list</button>
            </div>
        );
    },

    render() {
        return (
            <div>
                {this.renderToolbar()}
                <Slate.Editor placeholder={'Enter some text...'}
                              plugins={plugins}
                              state={this.state.state}
                              onChange={this.onChange}
                              schema={SCHEMA} />
            </div>
        );
    }
});

ReactDOM.render(
    <Example />,
    document.getElementById('example')
);
