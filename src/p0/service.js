'use strict';

const ws = require("ws");
const express = require("express");
const ChainHandler = require("./blockchain")

const SVR_PORTS = {
    P2P: 8100
}

let _peers = [];

let _ch = new ChainHandler({
    block_num: 0,
    timestamp: Date.now(),
    previous_hash: "0x0",
    data: "genesis block"
})

class PeerSvr {

    static get peers() {
        return _peers
    }

    static get ch() {
        return _ch
    }

    constructor(port) {
        this.port = port
    }

    start() {
        this.svr = new WebSocket.Server({port: port})
        this.svr.on('connection', ws => {
            _peers.push(this.svr)
            PeerSvr.handler(ws)
        });
        return this
    }

    static rsp(ws, id, data) {
        ws.send(JSON.stringify({
            id: id,
            data: data
        }))
    }

    static broadcast(id, data) {
        _peers.forEach(ws.send(JSON.stringify({
            id: id,
            data: data
        })));
    }

    static handler(ws) {
        let msg = JSON.parse(data);

        ws.on('message', data => {
            var msg = JSON.parse(data);// todo: msg.data may not correct here (for a block data, json should not be parse)
            switch (msg.type) {
                case "req:ch/latestBlock":
                    PeerSvr.rsp(ws, "rsp:ch/latestBlock", PeerSvr.ch.latestBlock);
                    break;
                case "req:ch/chain":
                    PeerSvr.dealChainReq(ws, msg.data);
                    break;
                case "rsp:ch/latestBlock":
                    console.log(data)
                    PeerSvr.mergeBlock(msg.data);
                    break;
                case "rsp:ch/chain":
                    console.log(data)
                    PeerSvr.mergeChain(ws, msg.data);
                    break;
            }
        })
    }

    static dealChainReq(ws, peerLatestBlock) {
        // todo: deal with latest block
        PeerSvr.rsp(ws, "rsp:ch/chain", PeerSvr.ch.chain);
    }

    static mergeBlock(peerLatestBlock) {
        if (PeerSvr.ch.latestBlock.hash === peerLatestBlock.previousHash) {
            if (PeerSvr.ch.add(peerLatestBlock)) return;
        }
        PeerSvr.broadcast("req:ch/chain", PeerSvr.ch.latestBlock);
    }

    static mergeChain(ws, peerChain) {
        peerChain = peerChain.sort((b1, b2) => (b1.blockNum - b2.blockNum));

        let latestBlock = PeerSvr.ch.latestBlock

        if (PeerSvr.ch.genesis.hash !== peerChain[0].hash) {
            return; //genesis not equal
        }

        if (peerLatestBlock.blockNum <= latestBlock.blockNum) {
            PeerSvr.rsp(ws, "rsp:ch/latestBlock", PeerSvr.ch.latestBlock);
            return; //my chain is longer
        }

        let i = peerChain.length - 1;
        while (i > 0) {
            if (peerChain[i - 1].hash !== peerChain[i].previousHash) return; // chain error
            if (latestBlock.hash === peerChain[i].previousHash) break;
            i--;
        }
        if(this.ch.replaceWith(peerChain, i)){
            PeerSvr.broadcast("rsp:ch/latestBlock", PeerSvr.ch.latestBlock);
        }
    }

}
