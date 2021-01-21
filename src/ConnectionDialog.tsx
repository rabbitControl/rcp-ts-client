import * as React from 'react';
import ParameterWidget from './ParameterWidget'
import { Alert, Intent, InputGroup, ControlGroup, Text, Colors, Checkbox } from '@blueprintjs/core';
import { Parameter, Client, WebSocketClientTransporter, GroupParameter, TabsWidget, StringParameter } from 'rabbitcontrol';
import { SSL_INFO_TEXT, SSL_INFO_TEXT_FIREFOX } from './Globals';
import { Classes } from '@blueprintjs/core';
import App from './App';

type Props = {
};

type State = {
    isConnected: boolean;
    error?: string;
    client?: Client;
    host: string;
    protocol?: string[];
    parameters: Parameter[];
    serverVersion: string;
    serverApplicationId: string;
    rootWithTabs: boolean;
};

export default class ConnectionDialog extends React.Component<Props, State> {
    
    private addTimer?: number;
    private removeTimer?: number;

    private apikey = "";
    private projectname = "";

    constructor(props: Props) {
        super(props);

        this.state = {
            isConnected: false,
            host: window.location.hostname+(window.location.port !== "" ? (":"+window.location.port) : "")+'/clientend',
            parameters: [],
            serverVersion: "",
            serverApplicationId: "",
            rootWithTabs: false,        
        };
    }

    componentDidMount = () =>
    {        
        /**
         * If a hash is provided, try to connect right away
         */
        if (location.hash !== '')
        {
            this.splitRcpKey(location.hash.replace('#', ''));
            if (this.apikey !== "" && this.projectname !== "")
            {
                console.log("autoconnect");
                this.doConnect(this.state.host);
            }
        }
    }

    private splitRcpKey(key: string, connect = false)
    {
        const keyparts = key.split(/[\s,]+/);
        if (keyparts.length == 2)
        {
            this.apikey = keyparts[0];
            this.projectname = keyparts[1];
        }
    }

    updateClient = () => {
        if (this.state.client) {
            this.state.client.update();
        }
    }

    createParameterWidget(parameter: Parameter)
    {
        return <ParameterWidget key={parameter.id}
                                parameter={parameter} 
                                onSubmitCb={this.updateClient}/>;
    }

    createWidgets(parameter: Parameter[])
    {
        return parameter
        .filter(param => this.state.rootWithTabs === false || !(param instanceof GroupParameter))
        .sort((a: Parameter, b: Parameter): number => 
        {
            return ((a.order || 0) - (b.order || 0));
        })
        .map((param) => 
        { 
            return this.createParameterWidget(param); 
        });
    }

    setRcpKey = (e: any) => {
        this.splitRcpKey(e.currentTarget.value as string);
    }

    setTabsInRoot = (e: React.FormEvent<HTMLElement>) => {
        this.setState({
            rootWithTabs: (e.target as HTMLInputElement).checked,
        });
    }


    render() 
    {
        return <section>

            <div className="rootgroup-wrapper">
                {
                    this.state.client ?

                        this.state.rootWithTabs === true ?

                            <ParameterWidget
                                key={0}
                                parameter={this.state.client.getRootGroup()}
                                onSubmitCb={this.updateClient}
                            />
                        :
                            this.createWidgets(this.state.parameters)

                    :
                        ""
                }
            </div>


            <div className="serverid" style={{
                color: Colors.GRAY1, 
            }}>
                {this.state.serverApplicationId !== "" ? `connected to: ${this.state.serverApplicationId} - ` : ""}{this.state.serverVersion !== "" ? `rcp: ${this.state.serverVersion}` : ""}
            </div>

            <Alert
                style={{
                    maxWidth: '800px',
                    width: '100%'
                }}
                className={"bp3-dark"}
                confirmButtonText="Connect"
                icon="offline"
                intent={Intent.NONE}
                isOpen={this.state.isConnected !== true }
                onConfirm={this.handleAlertConfirm}
            >
                <Text><strong>Connect to a RCP Tunnel</strong></Text>
                <br/>
                <br/>
                <ControlGroup style={{alignItems: "center"}} fill={true}>
                    <Text className={Classes.FIXED}>Rcp Key:&nbsp;</Text>
                    <InputGroup
                        type="text"
                        onChange={this.setRcpKey}
                    />
                </ControlGroup>
                <br />

                <Checkbox
                    checked={this.state.rootWithTabs}
                    onChange={this.setTabsInRoot}
                >
                    Tabs in Root
                </Checkbox>

                <div>
                    {this.state.error ? this.state.error : undefined}
                    {this.returnSSLInfo()}
                </div>

            </Alert>
        
        </section>;
    }

    private returnSSLInfo() {
        const isSSL = window.location ? window.location.toString().startsWith("https") : false;
        const isFirefox = navigator.userAgent.indexOf("Firefox") != -1;

        if (isSSL && isFirefox) {
            return (
                <div>
                    <br/>
                    {SSL_INFO_TEXT}
                    <br/><br/>
                    {SSL_INFO_TEXT_FIREFOX}
                </div>
            );
        } else if (isSSL) {
            return (
                <div>
                    <br/>
                    {SSL_INFO_TEXT}
                </div>
            );
        }
    }

    private handleAlertConfirm = () => {

        this.setState({
            error: undefined
        });

        if (this.apikey !== "" && this.projectname !== "")
        {
            this.doConnect(this.state.host);
        }
        else
        {
            console.error("no api key and/or project");
        }
    }

    private resetUI()
    {
        if (Client.VERBOSE) console.log("reset UI");

        this.stopTimers();

        this.setState({
            isConnected: false, 
            client: undefined, 
            parameters: [],
            serverVersion: "",
            serverApplicationId: "",
        });
    }

    private doDisconnect = () => {
        
        const client = this.state.client;

        if (client) {
            // clear callbacks
            // TODO: do this in client
            client.connected = undefined;
            client.disconnected = undefined;            
            client.onError = undefined;
            client.parameterAdded = undefined;
            client.parameterRemoved = undefined;

            // dispose client
            client.dispose();
        }

        this.resetUI();
    }

    private doConnect = (host: string) => {

        if (host !== undefined &&
            host !== "")
        {
            // disconnect first
            this.doDisconnect();

            // set info
            this.setState({
                host: host,
                error: undefined
            });

            console.log("this.apikey: " + this.apikey);
            console.log("this.projectname: " + this.projectname);

            const transporter = new WebSocketClientTransporter([this.apikey, this.projectname]);
            transporter.doSSL = document.location ? document.location.protocol.startsWith("https") : false;
            const client = new Client(transporter);

            // NOTE: needed??
            client.setRootWidget(new TabsWidget());
    
            const { connected, disconnected, parameterAdded, parameterRemoved, onError, onServerInfo } = this;
            Object.assign(client, { connected, disconnected, parameterAdded, parameterRemoved, onError, onServerInfo });
    
            try {
                client.connect(host);

                this.setState({
                    client: client
                });

            } catch (e) {
                console.log(e);
            }
        }
    }

    /**
     * client callbacks - socket
     */
    private connected = () => 
    {
        this.setState({
            isConnected: true,
        });

        if (Client.VERBOSE) console.log("ConnectionDialog connected!");
    }

    private disconnected = (event: CloseEvent) => 
    {
        if (Client.VERBOSE) console.log("ConnectionDialog disconneted: " + JSON.stringify(event));

        this.setState({
            error: `disconnected${event.reason ? ": " + JSON.stringify(event.reason) : ""}`
        });

        this.resetUI();
    }

    private onError = (error: any) => {

        if (error instanceof Error) {
            console.error(error.message);
        } else {
            this.setState({
                error: error.toString(),
            });
            this.resetUI();
        }

    }

    /**
     * client callbacks info
     */
    private onServerInfo = (version: string, applicationId: string) => 
    {
        this.setState({
            serverVersion: version,
            serverApplicationId: applicationId
        });
    }

    private parameterChangeListener = (parameter: Parameter) => 
    {
        if (!parameter.onlyValueChanged())
        {
            if (parameter.parent !== undefined)
            {
                if (Client.VERBOSE) console.log("parameter changed: " +  parameter.parent.label);
            }
            else if (parameter.parentChanged())
            {
                if (this.state.client)
                {
                    this.setState({
                        parameters: this.state.client.getRootGroup().children,
                    });
                }
            }
            else
            {
                if (Client.VERBOSE) console.log("paraemter changed: no parent");                
            }
            
            //force redraw
            this.forceUpdate();
        }
    }

    /**
     * client callbacks parameter
     */
    private parameterAdded = (parameter: Parameter) => 
    {
        parameter.addChangeListener(this.parameterChangeListener);

        // delay setting parameter
        // more paramater might arrive in quick succession
        if (this.addTimer !== undefined) {
            window.clearTimeout(this.addTimer);
            this.addTimer = undefined;
        }

        this.addTimer = window.setTimeout(() => {
            if (this.state.client)
            {
                this.setState({
                    parameters: this.state.client.getRootGroup().children,
                });
            }
        }, 100);
    }

    private parameterRemoved = (parameter: Parameter) =>
    {        
        // this.rootParam.removeChild(parameter);
        parameter.removeFromParent();

        parameter.removeChangedListener(this.parameterChangeListener);        

        if (this.state.client)
        {
            this.setState({
                parameters: this.state.client.getRootGroup().children,
            });
        }
    }

    /**
     * 
     */
    private stopTimers() {

        if (this.addTimer !== undefined) {
            window.clearTimeout(this.addTimer);
            this.addTimer = undefined;
        }

    }

} 
