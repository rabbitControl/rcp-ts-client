import * as React from 'react';
import ParameterWidget from './ParameterWidget'
import { InputGroup, ControlGroup, Text, Colors, Checkbox, Button, Dialog, Classes, Icon, NumericInput } from '@blueprintjs/core';
import { Parameter, Client, WebSocketClientTransporter, GroupParameter, TabsWidget } from 'rabbitcontrol';
import { DEFAULT_RCP_PORT, HTTP_PORT, SSL_INFO_TEXT, SSL_INFO_TEXT_FIREFOX, SSL_PORT } from './Globals';
import App from './App';
import ShareConnectionDialog from './ShareConnectionDialog';
import ConnectionHistoryList from './ConnectionHistoryList';
import { ConnectionHistoryProvider } from './ConnectionHistoryProvider';

type Props = {
};

type State = {
    isConnected: boolean;
    error?: string;
    client?: Client;
    host: string;
    port: number;
    parameters: Parameter[];
    serverVersion: string;
    serverApplicationId: string;
    rootWithTabs: boolean;
    showShareConnectionDialog: boolean;
};

export default class ConnectionDialog extends React.Component<Props, State>
{
    //
    private addTimer?: number;

    constructor(props: Props) {
        super(props);

        this.state = {
            isConnected: false,
            host: 'localhost',
            port: 10000,
            parameters: [],
            serverVersion: "",
            serverApplicationId: "",
            rootWithTabs: false,
            showShareConnectionDialog: false,
        };
    }

    componentDidMount = () => {
        
        // paarse parameters
        if (window.location.search !== "") {
            const params = new URLSearchParams(window.location.search);

            // t: tabs in roots
            if (params.has("t")) {
                this.setState({rootWithTabs: (parseInt(params.get("t") || "0") || 0) > 0});
            }

            // d: debug
            if (params.has("d")) {
                Client.VERBOSE = (parseInt(params.get("d") || "0") || 0) > 0 || false;
                App.VERBOSE_LOG = Client.VERBOSE;
                if (Client.VERBOSE) {
                    console.log("debug log on");                    
                }
            }
        }

         // autoconnect
         if (window.location.hash !== '') {
            const [host, port] = window.location.hash.replace('#', '').split(':');
            const portAsInt = parseInt(port, 10) || DEFAULT_RCP_PORT;

            if (Client.VERBOSE) console.log("autoconnect: " + host + ":" + portAsInt);
            this.doConnect(decodeURIComponent(host), portAsInt);
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

    setHost = (e: any) => {
        this.setState({
            host: e.currentTarget.value as string,
        });
    }

    setPort = (valueAsNumber: number, valueAsString: string, inputElement: HTMLInputElement | null) => {
        this.setState({
            port: valueAsNumber,
        });
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


            { this.state.isConnected ? 
                <div className="serverid" style={{ color: Colors.GRAY1 }}>
                    {this.state.serverApplicationId !== "" ? `Connected to: ${this.state.serverApplicationId} - ` : ""}{this.state.serverVersion !== "" ? `rcp: ${this.state.serverVersion}` : ""}
                    &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                    <a style={{
                        color: Colors.GRAY1
                    }} onClick={() => this.state.client?.disconnect()}>Disconnect</a>
                    &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                    <a
                        style={{
                            color: Colors.GRAY1,
                            fontSize: "1.15em"
                        }} 
                        onClick={() => { this.setState({ showShareConnectionDialog: true }) }}
                    >
                        Share&nbsp;&nbsp;
                        <Icon style={{
                            verticalAlign: "center"
                        }}
                            icon='share'
                        ></Icon>
                    </a>
                </div>

                :
                
                null
            }
            
            <ShareConnectionDialog
                show={this.state.showShareConnectionDialog}
                onClose={() => { this.setState({ showShareConnectionDialog: false }) }}
                host={this.state.host}
                port={this.state.port}
            />

            <Dialog isOpen={this.state.isConnected !== true }
                    className="bp3-dark connection-dialog">
                
                <section className={ Classes.DIALOG_BODY }>
                    
                    <h3>Connect to a RabbitControl server</h3>
                    
                    <ControlGroup style={{alignItems: "center"}}>
                        <Text>Host:&nbsp;</Text>
                        <InputGroup
                            value={this.state.host}
                            type="text"
                            onChange={this.setHost}
                        />
                    </ControlGroup>

                    <br/>
                    
                    <ControlGroup style={{ alignItems: "center" }}>
                        <Text>Port:&nbsp;</Text>
                        <NumericInput
                            value={this.state.port.toFixed(0)}
                            allowNumericCharactersOnly={true}
                            selectAllOnFocus={true}
                            asyncControl={true}
                            onValueChange={this.setPort}
                            min={1024}
                            max={65535}
                            minorStepSize={1}
                        >
                        </NumericInput>                        
                    </ControlGroup>
                    <br/>

                    <Checkbox
                        checked={this.state.rootWithTabs}
                        onChange={this.setTabsInRoot}
                    >
                        Tabs in Root &nbsp;<Icon icon="segmented-control" color={ Colors.GRAY1 } />
                    </Checkbox>

                    <div>
                        {this.state.error ? this.state.error : undefined}
                        {this.returnSSLInfo()}
                    </div>

                    <section style={ { textAlign: 'right' }}>
                        <Button text="Connect" onClick={ this.handleAlertConfirm } />
                    </section>

                    <ConnectionHistoryList onConnectFromHistoryItem={ this.connectFromHistoryItem } />
                </section>
            </Dialog>
        
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

        this.doConnect(this.state.host, this.state.port);
    }

    private connectFromHistoryItem = (item: ConnectionHistoryProvider.HistoryItem): void => {
        this.setState({
            error: undefined
        });

        this.doConnect(item.address, item.port);
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

    private doConnect = (host: string, port: number) => {

        if (host !== undefined &&
            host !== "" &&
            !isNaN(port))
        {
            //------------------------------
            // transform rabbithole url
            
            if (host.startsWith("wss") ||
                host.startsWith("https"))
            {
                port = SSL_PORT;
            }
            else if (host.startsWith("ws") ||
                host.startsWith("http"))
            {
                port = HTTP_PORT;
            }

            if (host.startsWith("https://rabbithole.rabbitcontrol.cc") &&
                host.includes("client/index.html"))
            {
                if (host.includes("mode=private#"))
                {
                    host = host.replace("client/index.html?mode=private#", "rcpclient/connect?key=");
                }
                else
                {
                    host = host.replace("client/index.html#", "public/rcpclient/connect?key=");
                }
            }

            //------------------------------
            // try to connect

            console.log(`trying to connect: ${host}:${port}`);

            // disconnect first
            this.doDisconnect();

            // set info
            this.setState({
                host: host,
                port: port,
                error: undefined
            });

            const client = new Client(new WebSocketClientTransporter())

            // NOTE: needed??
            client.setRootWidget(new TabsWidget());
    
            const { connected, disconnected, parameterAdded, parameterRemoved, onError, onServerInfo } = this;
            Object.assign(client, { connected, disconnected, parameterAdded, parameterRemoved, onError, onServerInfo });
    
            try {
                client.connect(host, port);

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

        ConnectionHistoryProvider.recordOrUpdateEntry(
            this.state.host,
            this.state.port,
            this.state.rootWithTabs
        );
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

        ConnectionHistoryProvider.setApplicationIdForEntry(
            this.state.host,
            this.state.port,
            this.state.rootWithTabs,
            applicationId
        );
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
