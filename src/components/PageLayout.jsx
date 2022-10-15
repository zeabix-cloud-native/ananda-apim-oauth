import React, { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import Navbar from "react-bootstrap/Navbar";
import { useIsAuthenticated } from "@azure/msal-react";
import { SignInButton } from "./SignInButton";
import { SignOutButton } from "./SignOutButton";

import { loginRequest } from "../authConfig";
import { Card, Tabs, Tab, Nav } from "react-bootstrap";
import JSONPretty from 'react-json-pretty';
import "./PageLayout.css";

/**
 * Renders the navbar component with a sign-in button if a user is not authenticated
 */
export const PageLayout = (props) => {
    const isAuthenticated = useIsAuthenticated();
    
    const { instance, accounts } = useMsal();

    const parseJwt = (token) => {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    
        return JSON.parse(jsonPayload);
    };

    const prettyPrintJson = ({data}) => {
        // (destructured) data could be a prop for example
        return (<div><pre>{ JSON.stringify(data, null, 2) }</pre></div>);
    }

    const tokenRequest = {
        account: accounts[0], // This is an example - Select account based on your app's requirements
        scopes: loginRequest.scopes,
    }

    const [token, setToken] = useState({
        accessToken: "",
        atjson: {},
        idToken: "",
        idjson: {},
    });

    // Tab states
    const [accessTokenkey, setAccessTokenKey] = useState('raw');
    const [idTokenKey, setIdTokenKey] = useState('jwt');
    

    useEffect(() => {
        instance.acquireTokenSilent(tokenRequest).then((response) => {
            setToken({
                accessToken: response.accessToken,
                atjson: parseJwt(response.accessToken),
                idToken: response.idToken,
                idjson: parseJwt(response.idToken),
            })
        })
        .catch(async (e) => {
            console.log(e);
        })
    }, [])

    return (
        <>
            <Navbar bg="primary" variant="dark">
                <Nav className="container-fluid">
                    <Nav.Item>
                        <Navbar.Brand>Demo AAD Login</Navbar.Brand>
                    </Nav.Item>
                    <Nav.Item className="ml-auto">
                    { isAuthenticated ? <SignOutButton /> : <SignInButton /> }
                    </Nav.Item>
                </Nav>              
            </Navbar>
            { isAuthenticated ? 
            <div className="tokenArea">
            <Card className="tokenCard">                
                <Card.Body>
                <Card.Title>Access Token</Card.Title>
                    <Tabs
                        id="access-token-tabs"
                        activeKey={accessTokenkey}
                        onSelect={(k) => setAccessTokenKey(k)}
                        className="mb-3"
                        >
                        <Tab eventKey="raw" title="Raw">
                            <div>{token.accessToken}</div>
                        </Tab>
                        <Tab eventKey="jwt" title="Jwt">
                            <JSONPretty data={token.atjson} ></JSONPretty>
                        </Tab>
                    </Tabs>
                </Card.Body>
            </Card>
            <Card className="tokenCard">
                <Card.Body>
                <Card.Title>Id Token</Card.Title>
                    <Tabs
                        id="access-token-tabs"
                        activeKey={idTokenKey}
                        onSelect={(k) => setIdTokenKey(k)}
                        className="mb-3"
                        >
                        <Tab eventKey="raw" title="Raw">
                            <div>{token.idToken}</div>
                        </Tab>
                        <Tab eventKey="jwt" title="Jwt">
                            <JSONPretty data={token.idjson} ></JSONPretty>
                        </Tab>
                    </Tabs>
                </Card.Body>
            </Card>
            </div> : <div/> }
            
            <br />
            <br />
            {props.children}
        </>
    );
};