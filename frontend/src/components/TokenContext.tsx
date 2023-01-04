import React, { createContext, useEffect, useState } from 'react';
import { ethers, Contract } from 'ethers';
import Token from '../Token.json';

interface ITokenState {
    signer: ethers.providers.JsonRpcProvider;
    signerAddress: string;
    token: Contract;
    ownerBalance: string;
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: string;
    lastTx: string;
}

interface ITokenContext {
    tokenState: ITokenState;
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    isConnected: boolean;
    isLoading: boolean;
    giveaway: () => Promise<void>;
    distruct: () => Promise<void>;
}

export const TokenContext = createContext<ITokenContext>({} as ITokenContext);

const { ethereum } = window as any;

export const TokenProvider = ({ children }: {
    children: React.ReactNode;
}) => {
    const [tokenState, setTokenState] = useState({
        signer: {} as ethers.providers.JsonRpcProvider,
        signerAddress: '',
        token: {} as Contract,
        ownerBalance: '',
        name: '',
        symbol: '',
        decimals: 0,
        totalSupply: '',
        lastTx: '',
    } as ITokenState);
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const connect = async () => {
        setIsLoading(true);
        try {
            if (!ethereum) return alert("Please install metamask");
            await ethereum.request({ method: "eth_requestAccounts" });
            await updateTokenState();
        } catch (error) {
            console.log(error);
            setIsConnected(false);
        }
        setIsLoading(false);
    };

    const updateTokenState = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(ethereum, "any");
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const signerAddress = await signer.getAddress();

            const token = new Contract(
                Token.address,
                Token.abi,
                provider
            );
            const tokenSigner = token.connect(signer);

            const ownerBalance = ethers.utils.formatEther((await tokenSigner.balanceOf(signerAddress)));
            const name = await tokenSigner.name();
            const symbol = await tokenSigner.symbol();
            const decimals = parseFloat(ethers.utils.formatEther(await tokenSigner.decimals())) * 10 ** 18;
            const totalSupply = ethers.utils.formatEther(await tokenSigner.totalSupply());
            setTokenState({
                ...tokenState,
                signer: provider,
                signerAddress: signerAddress,
                token: tokenSigner,
                ownerBalance: ownerBalance,
                name: name,
                symbol: symbol,
                decimals: decimals,
                totalSupply: totalSupply,
            });
            setIsConnected(true);
        }
        catch (err: any) {
            if (err.code === "CALL_EXCEPTION")
                alert("The contract is not deployed or destructed");
            else
                console.log(err);
            setIsConnected(false);
        }
    };

    const giveaway = async () => {
        setIsLoading(true);
        try {
            const tx = await tokenState.token.giveaway(Token.accounts, "40000" + "0".repeat(tokenState.decimals));
            setTokenState({
                ...tokenState,
                lastTx: tx.hash,
            });
            await tx.wait();
            await updateTokenState();
        }
        catch (err) {
            console.log(err);
        }
        setIsLoading(false);
    };

    const distruct = async () => {
        setIsLoading(true);
        try {
            const tx = await tokenState.token.distruct();
            setTokenState({
                ...tokenState,
                lastTx: tx.hash,
            });
            await tx.wait();
            setTimeout(async () => {
                await updateTokenState();
            }, 3000);
        }
        catch (err) {
            console.log(err);
        }
        setIsLoading(false);
    };

    const disconnect = async () => {
        try {
            setTokenState({
                signer: {} as ethers.providers.JsonRpcProvider,
                signerAddress: '',
                token: {} as Contract,
                ownerBalance: '',
                name: '',
                symbol: '',
                decimals: 0,
                totalSupply: '',
                lastTx: '',
            } as ITokenState);
            setIsConnected(false);
        }
        catch (err) {
            console.log(err);
        }
    };

    return (
        <TokenContext.Provider value={{
            tokenState,
            connect,
            isConnected,
            disconnect,
            isLoading,
            giveaway,
            distruct,
        }}>
            {children}
        </TokenContext.Provider>
    );
};

