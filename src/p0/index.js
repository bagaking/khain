'use strict';

const express = require("express")
const bodyParser = require('body-parser');
const PeerSvr = require("./peerSvr")

const networks = {
    "f" :{
        port_p2p: 3080,
        port_http: 8080
    },
    "s" :{
        port_p2p: 3081,
        port_http: 8081
    }
}

function start({port_p2p, port_http}){
    console.log(`start : ${port_p2p} ${port_http}`)
    let ps = new PeerSvr(port_p2p).start()
    let app = express();
    app.use(bodyParser.json());

    app.get('/blocks/all', (req, res) => res.send(JSON.stringify(PeerSvr.ch.chain)));
    app.get('/blocks/latest', (req, res) => res.send(JSON.stringify(PeerSvr.ch.latestBlock)));
    app.get('/peers/all', (req, res) => res.send(PeerSvr.peersMap));
    app.post('/peers/add', (req, res) => {
        PeerSvr.addPeers(req.body.peers)
        res.send('{"status":"ok"}');
    });
    app.post('/mine/new', (req, res) => {
        console.log('/mine/new ' + JSON.stringify(req.body))
        let blockNew = PeerSvr.ch.generateNext(req.body.data);
        let result = blockNew && PeerSvr.ch.add(blockNew)
        if(result){
            PeerSvr.rspLatest(PeerSvr.peers)
        };
        res.send(JSON.stringify({
            status : result ? "ok" : "failed"
        }));
    });

    app.listen(port_http, () => console.log("rpc svr start at port : " + port_http));
}

start(networks["s"])