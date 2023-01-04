import { useContext } from 'react';
import { TokenContext } from '../components/TokenContext';


const Dashboard = () => {
    const { tokenState,
        connect,
        isConnected,
        isLoading,
        disconnect,
        giveaway,
        distruct,
    } = useContext(TokenContext);

    return (
        <div className="App" style={{ textAlign: "center", paddingTop: "0.4em" }}>
            <h1>Token Dashboard</h1>

            {isLoading ? <h2>Loading...</h2> : isLoading}
            <br />
            {
                isConnected ? <>
                    <h1>Name: {tokenState.name}</h1>
                    <h1>Symbol: {tokenState.symbol}</h1>
                    <h1>Decimals: {tokenState.decimals}</h1>
                    <h1>Total Supply: {tokenState.totalSupply}</h1>
                    <h1>Owner Balance: {tokenState.ownerBalance}</h1>
                    <a target="_blank" href={"https://testnet.bscscan.com/token/" + tokenState.token.address}>
                        <h2>See on bsc scan</h2>
                    </a>
                    <br />
                    {tokenState.lastTx !== '' ?
                        <>
                            <a target="_blank" href={"https://testnet.bscscan.com/tx/" + tokenState.lastTx}>
                                <h3>Last transaction</h3>
                            </a>
                            <br />
                        </> : null
                    }
                    <button onClick={() => disconnect()}>Disconnect</button>
                    <br />
                    <button onClick={() => giveaway()}>Giveaway</button>
                    <br />
                    <button onClick={() => distruct()}>Distruct</button>
                </> :
                    <button onClick={() => connect()}>Connect</button>
            }
        </div>
    );
};

export default Dashboard;