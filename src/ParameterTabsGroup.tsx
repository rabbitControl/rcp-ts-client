import * as React from 'react';
import { InjectedProps, parameterWrapped } from './ElementWrapper';
import { Parameter, GroupParameter } from 'rabbitcontrol';
import ParameterWidget from './ParameterWidget';
import ContentContainer from './ContentContainer';
import { Tab, Tabs } from 'carbon-components-react';

interface Props {
    style?: React.CSSProperties;
    selectedTab: number;
    tabId: number;
};

interface State {
    navbarTabId: number;
    lastSelected: number;
}

export class ParameterTabsGroupC extends React.Component<Props & InjectedProps, State>
{
    constructor(props: Props & InjectedProps) {
        super(props);

        this.state = {
            navbarTabId: 0,
            lastSelected: -1
        };
    }

    componentDidMount(): void
    {
        // console.log(`PTG MOUNTED: ${this.props.parameter?.label} (${this.props.tabId}) sel: ${this.props.selectedTab}`);
        
        if (this.props.selectedTab !== this.props.tabId)
        {
            this.setState({ navbarTabId: -1 });
        }
    }

    handleTabChange = (navbarTabId: number) => 
    {   
        this.setState({ navbarTabId: navbarTabId });
    }

    onSubmit = () =>
    {
        if (this.props.onSubmitCb)
        {
            this.props.onSubmitCb();
        }
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

    createTabWidgets(parameters: Parameter[])
    {
        if (parameters === undefined)
        {
            console.log("no children");            
            return "";
        }

        // each group-parameter gets a tab

        return parameters
        .filter(param => param instanceof GroupParameter)
        .sort((a: Parameter, b: Parameter): number => ((a.order || 0) - (b.order || 0)))
        .map((param, index) => 
        {
            // console.log(`${this.props.parameter?.label}: create Tab: ${param.label} - props.selected: ${this.props.selected}`);

            const g_param = (param as GroupParameter);            

            // if (this.state.navbarTabId === 0
            //     && index === 0
            //     && param.label !== undefined)
            // {
            //     // set this delayed!
            //     // TODO
            //     // this.setState({navbarTabId: (param.label as string)});
            // }


            return (

                <Tab
                    key={"tab_" + param.id} 
                    id={param.label} 
                    label={param.label}                    
                >
                    <ContentContainer
                        parameter={g_param}
                        onSubmitCb={this.props.onSubmitCb}
                        selectedTab={this.state.navbarTabId}
                        tabId={index}
                    ></ContentContainer>

                    {/* {g_param.children.some(e => !(e instanceof GroupParameter)) ?
                        <div>
                            <hr className='parameter-divider' style={{borderTop: "1px solid gray"}}/>
                            {this.renderChildren()}
                        </div>
                    : ""
                    } */}
                </Tab>

            );
        });
    }


    componentDidUpdate(prevProps: Readonly<Props & InjectedProps>, prevState: Readonly<State>, snapshot?: any): void
    {
        // console.log(`PTG UPDATE: ${this.props.parameter?.label} (${this.props.id}) sel: ${this.props.selected} - last: ${this.state.lastSelected}`);

        if (this.state.lastSelected !== this.props.selectedTab)
        {
            if (this.props.selectedTab === this.props.tabId) {

                if (this.state.navbarTabId < 0)
                {                    
                    this.setState({
                        navbarTabId: 0,
                    });
                }
            }
            else
            {
                this.setState({
                    navbarTabId: -1
                });
            }
            
            this.setState({ lastSelected: this.props.selectedTab });
        }
    }

    render()
    {
        const param = this.props.parameter;

        return (
            <Tabs
                type="container"
                id={param?.id.toString() || "navbar"}
                onSelectionChange={this.handleTabChange}
                selected={this.state.navbarTabId}
                style={this.props.style}
            >
                {/* {this.props.labelDisabled !== true ? <Tab title={label} disabled={true}></Tab> : <div></div>} */}
                {this.createTabWidgets((this.props.parameter as GroupParameter).children)}
            </Tabs>
        );
    }

};

export const ParameterTabsGroup = parameterWrapped({ignoreReadonly: true})(ParameterTabsGroupC);