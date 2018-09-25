'use strict';

const WebSocket = require("ws")
const R = require("ramda")
const DB = require("../utils/db")
const EventEmitter = require("events")
const GlobalConf = require("../../globalConf")
/*
    plan :
    - connect to peer
        - assign : handle coming message about maintaining peer networking
        - assign : deliver coming message of application
        - process the first syncing procedure : register by application layer
        - maintaining peer networking
            - execute sync procedure once
                - send my connStr to target
                - broadcast the peer's info to others
                - execute what registered by application layer

 */

/*
    [peerMsg]
    type = "number" // peer = 0, msg
    id = "number"
    data = "literal"

 */

class PeerMsg {

    constructor(controlWord, id, data) {
        this.cw = controlWord | 0
        this.id = id
        this.data = data instanceof Object ? JSON.stringify(data) : data
    }

    get isPeerMsg() {
        return this.type === 0
    }

    get jsonStr() {
        return this.ToString()
    }

    ToString(){
        return JSON.stringify(this)
    }

    static fromString(jsonStr) {
        return this.fromJson(JSON.parse(jsonStr))
    }

    static fromJson(jsonObj){
        return new this(jsonObj.cw, jsonObj.id, jsonObj.data)
    }

}


class PeerMgr {

    /**
     * Create a peer mgr
     * @param {string} host - my connection address
     * @param {string} port - my connection port
     */
    constructor(host, port) {
        /** @type {{string:WebSocket}} */
        this.nodes = {}; //initialize node table
        this.host = host;
        this.port = port;
        /** @type {EventEmitter} */
        this.emitter = new EventEmitter();
        /** @type {DB} - handle avaliable peer table, */
        this.db = new DB(`${GlobalConf.dirRoot}/runtime/p1/${this.host}/${this.port}`)
    }

    /**
     * get connection string
     * @returns {string}
     */
    get connStr() {
        return `${this.host}:${this.port}`
    }

    addPeerNodes(...connStrs) {
        R.forEach(connStr => {
            // checking self
            if (connStr === this.connStr) {
                return
            }

            if (this.nodes[connStr] === undefined || this.nodes[connStr] === null) { // I dont know the peer before
                let ws = new WebSocket(`ws://${connStr}`); // Try connect
                ws.on('open', () => this.OnNodeConnected(connStr, ws)); // If success
            }
        }, connStrs)
    }

    OnNodeConnected(connStr, ws) {
        this.nodes[connStr] = ws; // Record the peer to my peer table
        ws.on('message', jsonStr => {
            let msg = PeerMsg.fromString(jsonStr)
            let msgInfo = {
                connStr,
                msg
            }
            console.log(`receive msg : ${msg}`)

            if(msg.isPeerMsg){ // assign : handle coming message about maintaining peer networking
                this.OnPeerMsg(connStr, msgInfo)
            }else{ //assign : deliver coming message of application
                this.emitter.emit('msgReceived', msgInfo);
            }
        })
        ws.on('close', () => this.nodes[connStr] = null)
        ws.on('error', () => this.nodes[connStr] = null)

        this.OnPeerConnected(connStr, ws)
    }

    OnPeerMsg(connStr, ws) {
        //todo:
    }

    OnPeerConnected(connStr){
        //todo: send my connStr to target
        //todo: broadcast the peer's info to others have been connected
        this.emitter.emit('peerConnected', connStr); // execute what registered by application layer : send latest block
    }

    /**
     * send msg to specific conn
     * @param {string} connStr
     * @param {PeerMsg} msg
     */
    send(connStr, msg){
        let ws = this.nodes[connStr]
        ws.send(msg.jsonStr)
    }

}

module.exports = { PeerMsg, PeerMgr}