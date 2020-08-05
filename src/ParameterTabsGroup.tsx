import * as React from 'react';
import { InjectedProps, parameterWrapped } from './ElementWrapper';
import { Colors, Text, Tabs, Tab, TabId } from '@blueprintjs/core';
import { Parameter, RcpTypes, GroupParameter } from 'rabbitcontrol';
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
        console.log("tab changed: " + navbarTabId);
        this.setState({ navbarTabId });
    }

    updateClient = () =>
    {
        console.log("SUBMIT");
        if (this.props.onSubmitCb)
        {
            this.props.onSubmitCb();
        }
    }
    
    createChildWidgets(parameter: Parameter[]) {
        return parameter.sort((a: Parameter, b: Parameter): number =>
        { 
            return ((a.order || 0) - (b.order || 0)); 
        })
        .map((param) =>
        {
            return <ParameterWidget 
                        key={param.id}
                        parameter={param} 
                        onSubmitCb={this.updateClient}
                        renderchildrenintabs="true"
                    />;
        });
    }

    createTabWidgets(parameter: Parameter[])
    {
        if (parameter === undefined) {
            return <div key={1}>no param</div>
        }

        return parameter
        .filter(param => param instanceof GroupParameter)
        .map((param, index) => 
        {
            const g_param = (param as GroupParameter);

            if (this.state.navbarTabId === 0
                && index === 0
                && param.label !== undefined) {
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
                                {/* {this.createChildWidgets(g_param.children)}
                                 */}

                                 {(param instanceof GroupParameter && param.widget !== undefined && param.widget.widgetType === RcpTypes.Widgettype.TABS) ? (<ParameterWidget key={"_"+param.id}
                                    parameter={param} 
                                    onSubmitCb={this.updateClient}>
                                        {this.createChildWidgets(g_param.children)}
                                    </ParameterWidget>) : (this.createChildWidgets(g_param.children))}

                            </div>
                            <hr/>
                            <div>
                                {this.props.children}
                            </div>
                            </div>}
                    />;
        });
    }
    
    render() {

        let label = "no label";
        const param = this.props.parameter;
        
        if (param 
            && param.label !== undefined) 
        {
            label = param.label;
        }

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