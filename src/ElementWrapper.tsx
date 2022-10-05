import * as React from 'react';
import { Parameter, ValueParameter } from 'rabbitcontrol';
import {BangParameter} from 'rabbitcontrol';
import App from './App';

interface ExternalProps {
    label: string;
    userid: string;
    registerElement: (element:RegisterCB) => void;
    unregisterElement: (element:RegisterCB) => void;
    onSubmitCb: () => void;
}

export interface InjectedProps {
    value: any;
    parameter?: Parameter;
    disabled?: boolean;    
    handleValue?: (value: any) => void;
    onSubmitCb?: () => void;
    selectedTab?: number;
    tabId?: number;
}

type State = {
    parameter?: Parameter;
    label?: string;
    description?: string;
    value: any;
    readonly?: boolean;
};


export interface RegisterCB {
    setParameter(parameter: Parameter): void;
    removeParameter(parameter: Parameter): void;
    getUserid(): string;
}


interface Config {
    ignoreReadonly?: boolean;
};

export const parameterWrapped = (config?: Config) =>
    <TOriginalProps extends {}>(
        Component: (React.ComponentClass<TOriginalProps & InjectedProps>
                  | React.StatelessComponent<TOriginalProps & InjectedProps>)
    ) => {

        type ResultProps = TOriginalProps & ExternalProps;

        const result = class ParameterComponentWrapper extends React.Component<ResultProps, State> implements RegisterCB {
            
            static displayName = `ParameterComponentWrapper(${Component.displayName || Component.name})`;
            private ignoreReadonly = config ? config.ignoreReadonly : undefined;

            constructor(props: ResultProps) {
                super(props);
                this.state = {
                    label: this.props.label,
                    value: null,
                    parameter: undefined,            
                };
            }

            // override
            componentDidMount() {
                this.props.registerElement(this);
            }

            // override
            componentWillUnmount() {
                const param = this.state.parameter;
                if (param) {
                    this.unregisterParameterHandlers(param);
                }
        
                this.props.unregisterElement(this);
            }

            /**
             * RegisterCB interface
             * 
             * @param parameter 
             */
            setParameter(parameter: Parameter): void {

                if (parameter.userid !== this.props.userid) {
                    console.error(`userid mismatch! parameter: ${parameter.userid} - widget: ${this.props.userid}`);
                    return;
                }

                if (App.VERBOSE_LOG) {
                    console.log(`set parameter for widget (${this.props.userid})`);
                }

                this.registerParameterHandlers(parameter);
                this.setState({
                    parameter: parameter,
                    label: parameter.label,
                    readonly: parameter.readonly,
                });
            }

            removeParameter(param: Parameter): void {
                this.unregisterParameterHandlers(param);
                this.setState({
                    parameter: undefined,
                });
            }

            getUserid(): string {
                return this.props.userid;
            }

            /**
             * handle value
             */
            handleValue = (value: any) => {
                const param = this.state.parameter;
                if (param instanceof ValueParameter) {
                    param.value = value;
                    this.props.onSubmitCb();
                } else if (param instanceof BangParameter) {
                    param.doBang();
                    this.props.onSubmitCb();
                }

                this.setState({
                    value: value,
                })
            };

            // --------------------------------------------
            // render
            // --------------------------------------------
            render(): JSX.Element {

                const param = this.state.parameter;
                const readonly = this.state.readonly;

                return (
                        <Component
                            {...this.props} 
                            {...this.state} 
                            handleValue={this.handleValue}
                            disabled={param ? (readonly ? (!(this.ignoreReadonly === true)) : false) : true}
                        />
                );
            }


            // --------------------------------------------
            // --------------------------------------------
            private handleParameterValueChange = (parameter: Parameter) => {

                if (parameter instanceof ValueParameter) {

                    if (App.VERBOSE_LOG) {
                        console.log(`setting widget value (${parameter.userid}): ${parameter.value as string}`);                
                    }

                    this.setState({
                        value: parameter.value
                    });
                }
            }
        
            private handleParameterChange = (parameter: Parameter) => {
                this.setState({
                    label: parameter.label,
                    description: parameter.description,
                    readonly: parameter.readonly,
                });
            }
        
            private registerParameterHandlers(parameter: Parameter) {

                if (parameter instanceof ValueParameter) {                    
                    parameter.addValueChangeListener(this.handleParameterValueChange);                    
                    this.setState({                        
                        value: parameter.value,
                    });
                }
        
                parameter.addChangeListener(this.handleParameterChange); 
            }
        
            private unregisterParameterHandlers(parameter: Parameter) {
                if (parameter instanceof ValueParameter) {
                    parameter.removeValueChangedListener(this.handleParameterValueChange);
                }
                
                parameter.removeChangedListener(this.handleParameterChange);
            }
        };

        return result;
    };

