'use strict';

const ws = require("ws");
const ChainHandler = require("./blockchain")

let _peers = [];

let _ch = new ChainHandler({
    block_num: 0,
    timestamp: Date.now(),
    previous_hash: "0x0",
    data: "genesis block"
})

class PeerSvr {

    constructor(port) {
        this.port = port
    }

    start() {
        let svr = new WebSocket.Server({port: this.port})
        svr.on('connection', ws => {
            PeerSvr.handler(ws)
        })
        this.svr = svr
        return this
    }

    static get peers() {
        return _peers
    }

    static get peersMap() {
        return _peers.map(s => s._socket.remoteAddress + ':' + s._socket.remotePort)
    }

    static get ch() {
        return _ch
    }


    static rsp(ws, id, data) {
        let wss = ws instanceof Array ? ws : [ws]
        for (let w of wss) {
            w.send(JSON.stringify({
                id: id,
                data: data
            }))
        }
    }

    static broadcast(id, data) {
        _peers.forEach(ws.send(JSON.stringify({
            id: id,
            data: data
        })));
    }

    static handler(ws) {
        _peers.push(ws)
        ws.on('message', data => {
            var msg = JSON.parse(data);// todo: msg.data may not correct here (for a block data, json should not be parse)
            switch (msg.type) {
                case "req:ch/latestBlock":
                    PeerSvr.rspLatest(ws)
                    break;
                case "req:ch/chain":
                    PeerSvr.rspChain(ws)
                    break;
                case "rsp:ch/latestBlock":
                    console.log(data)
                    PeerSvr.mergeBlock(JSON.parse(msg.data));
                    break;
                case "rsp:ch/chain":
                    console.log(data)
                    PeerSvr.mergeChain(ws, JSON.parse(msg.data));
                    break;
            }
        })
        ws.on('close', () => _peers.splice(_peers.indexOf(ws), 1));
        ws.on('error', () => _peers.splice(_peers.indexOf(ws), 1));
    }

    static mergeBlock(peerLatestBlock) {
        if (PeerSvr.ch.latestBlock.hash === peerLatestBlock.previousHash) {
            if (PeerSvr.ch.add(peerLatestBlock)) return;
        }
        PeerSvr.broadcast("req:ch/chain");
    }

    static mergeChain(ws, peerChain) {
        peerChain = peerChain.sort((b1, b2) => (b1.blockNum - b2.blockNum));

        if (peerChain.length < PeerSvr.ch.blockHeight && PeerSvr.ch.genesis.hash === peerChain[0].hash) {
            PeerSvr.rspLatest(ws);
            return;
        }

        if (PeerSvr.ch.merge(peerChain)) {
            PeerSvr.rspLatest(PeerSvr.peers)
        }
    }

    static rspLatest(ws) {
        PeerSvr.rsp(ws, "rsp:ch/latestBlock", JSON.stringify(PeerSvr.ch.latestBlock));
    }

    static rspChain(ws) {
        PeerSvr.rsp(ws, "rsp:ch/chain", JSON.stringify(PeerSvr.ch.chain));
    }

}

module.exports = PeerSvr