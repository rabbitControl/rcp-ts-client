import * as React from 'react';
import { InjectedProps, parameterWrapped } from './ElementWrapper';
import { Colors, Tabs, Tab, TabId } from '@blueprintjs/core';
import { Parameter, GroupParameter, TabsWidget } from 'rabbitcontrol';
import ParameterWidget from './ParameterWidget';

interface Props {
    style?: React.CSSProperties;
};

interface State {
    navbarTabId: TabId;
};

export class ParameterTabsGroupC extends React.Component<Props & InjectedProps, State> {

    static readonly COMPONENT_DEFAULT_COLOR = Colors.GRAY1;

    constructor(props: Props & InjectedProps) {
        super(props);

        this.state = {navbarTabId: 0};
    } 

    handleTabChange = (navbarTabId: TabId) => 
    {
        this.setState({ navbarTabId });
    }

    onSubmit = () =>
    {
        if (this.props.onSubmitCb)
        {
            this.props.onSubmitCb();
        }
    }
    
    createChildWidgets(parameter: GroupParameter) 
    {
        if (parameter.widget instanceof TabsWidget) 
        {
            return (<ParameterWidget 
                key={"_"+parameter.id}
                parameter={parameter} 
                onSubmitCb={this.onSubmit}
            />);
        }


        return parameter.children
        .filter(param => 
        {
            const is_group = (param instanceof GroupParameter);
            var is_tabs = false;
            var parent_tabs = false;

            if (is_group)
            {
                is_tabs = param.widget instanceof TabsWidget;
            }

            if (param.parent !== undefined)
            {
                parent_tabs = param.parent.widget instanceof TabsWidget;
            }

            return !is_group || (!parent_tabs && !is_tabs);
        })
        .sort((a: Parameter, b: Parameter): number =>
        { 
            return ((a.order || 0) - (b.order || 0)); 
        })
        .map((param) =>
        {
            return <ParameterWidget 
                        key={param.id}
                        parameter={param} 
                        onSubmitCb={this.onSubmit}
                    />;
        });
    }

    renderChildren()
    {
        // render non-group chilren of this GroupParameter
        const parameter = this.props.parameter;

        if (parameter !== undefined)
        {
            return (parameter as GroupParameter).children
            .filter(param => !(param instanceof GroupParameter))
            .sort((a: Parameter, b: Parameter): number => ((a.order || 0) - (b.order || 0)))
            .map((p) =>
            { 
                return (
                    <ParameterWidget 
                        key={p.id}
                        parameter={p} 
                        onSubmitCb={this.onSubmit}
                    />
                );
            });
        }        
        
        return ("");
    }

    createTabWidgets(parameter: Parameter[])
    {
        if (parameter === undefined)
        {
            return "";
        }

        // each parameter gets a tab

        return parameter
        .filter(param => param instanceof GroupParameter)
        .sort((a: Parameter, b: Parameter): number => ((a.order || 0) - (b.order || 0)))
        .map((param, index) => 
        {
            const g_param = (param as GroupParameter);

            if (this.state.navbarTabId === 0
                && index === 0
                && param.label !== undefined)
            {
                // set this delayed!
                this.setState({navbarTabId: (param.label as string)});
            }

            return <Tab 
                    key={"tab_" + param.id} 
                    id={param.label} 
                    title={param.label} 
                    panel={<div>
                            <div className="inner" style={{
                                border: "1px solid #454545",
                                background: "transparent"
                            }}>
                                {this.createChildWidgets(g_param)}
                            </div>

                            {g_param.children.length > 0 ?
                                <div>
                                    <hr style={{borderTop: "1px solid gray"}}/>
                                    {this.renderChildren()}
                                </div>
                            : ""
                            }                            
                            </div>}
                    />;
        });
    }
    
    render() 
    {
        const param = this.props.parameter;
        const label = param?.label ?? "";

        return (
            <div style={this.props.style}>

                <Tabs 
                    id="navbar"
                    renderActiveTabPanelOnly={true}
                    onChange={this.handleTabChange} 
                    selectedTabId={this.state.navbarTabId}
                >
                    {/* {this.props.labelDisabled !== true ? <Tab title={label} disabled={true}></Tab> : <div></div>} */}
                    {this.createTabWidgets((this.props.parameter as GroupParameter).children)}
                </Tabs>
            </div>
        );
    }

};

export const ParameterTabsGroup = parameterWrapped({ignoreReadonly: true})(ParameterTabsGroupC);