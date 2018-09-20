# P0: Simple Block Chain Structure, With no consensus

## usage

1. edit the config in index.js
2. `node run ./src/po` with both 'f' and 's'
3. you can run these codes in bash
```bash
// check block state
curl localhost:8080/blocks/all
curl localhost:8081/blocks/all
// mine a block at svr_f
curl localhost:8080/mine/new -d '{"data":"asd"}' -H 'Content-Type: application/json'
curl localhost:8080/blocks/all
curl localhost:8081/blocks/all
// add svr_s to svr_f's peer list
curl localhost:8080/peers/add -H 'Content-Type: application/json' -d '{"peers":["ws://127.0.0.1:3081"]}'
curl localhost:8081/blocks/all
// mine a block at svr_f again
curl localhost:8080/mine/new -d '{"data":"asd"}' -H 'Content-Type: application/json'
curl localhost:8080/blocks/all
curl localhost:8081/blocks/all
```

## testing result

```bash
=> curl localhost:8080/blocks/all
[{"blockNum":0,"timestamp":0,"previousHash":"0x0","hash":"c0d73c5c2ef1da9272e19e41c9d37ec7723b9092e5998ec3240d81a00ae7cb89","data":"genesis block"}]%
=> curl localhost:8081/blocks/all
[{"blockNum":0,"timestamp":0,"previousHash":"0x0","hash":"c0d73c5c2ef1da9272e19e41c9d37ec7723b9092e5998ec3240d81a00ae7cb89","data":"genesis block"}]%
=> curl localhost:8080/mine/new -d '{"data":"asd"}' -H 'Content-Type: application/json'
{"status":"ok"}%
=> curl localhost:8080/blocks/all
[{"blockNum":0,"timestamp":0,"previousHash":"0x0","hash":"c0d73c5c2ef1da9272e19e41c9d37ec7723b9092e5998ec3240d81a00ae7cb89","data":"genesis block"},{"blockNum":1,"timestamp":1537462857,"previousHash":"c0d73c5c2ef1da9272e19e41c9d37ec7723b9092e5998ec3240d81a00ae7cb89","hash":"87d070b812b19b622abbac3213052b483872d39878bc091e83c9e744b09a1e83","data":"asd"}]%
=> curl localhost:8081/blocks/all
[{"blockNum":0,"timestamp":0,"previousHash":"0x0","hash":"c0d73c5c2ef1da9272e19e41c9d37ec7723b9092e5998ec3240d81a00ae7cb89","data":"genesis block"}]%
=> curl localhost:8080/peers/add -H 'Content-Type: application/json' -d '{"peers":["ws://127.0.0.1:3081"]}'
{"status":"ok"}%
=> curl localhost:8081/blocks/all
[{"blockNum":0,"timestamp":0,"previousHash":"0x0","hash":"c0d73c5c2ef1da9272e19e41c9d37ec7723b9092e5998ec3240d81a00ae7cb89","data":"genesis block"},{"blockNum":1,"timestamp":1537462857,"previousHash":"c0d73c5c2ef1da9272e19e41c9d37ec7723b9092e5998ec3240d81a00ae7cb89","hash":"87d070b812b19b622abbac3213052b483872d39878bc091e83c9e744b09a1e83","data":"asd"}]%
=> curl localhost:8080/mine/new -d '{"data":"asd"}' -H 'Content-Type: application/json'
{"status":"ok"}%
=> curl localhost:8080/blocks/all
[{"blockNum":0,"timestamp":0,"previousHash":"0x0","hash":"c0d73c5c2ef1da9272e19e41c9d37ec7723b9092e5998ec3240d81a00ae7cb89","data":"genesis block"},{"blockNum":1,"timestamp":1537462857,"previousHash":"c0d73c5c2ef1da9272e19e41c9d37ec7723b9092e5998ec3240d81a00ae7cb89","hash":"87d070b812b19b622abbac3213052b483872d39878bc091e83c9e744b09a1e83","data":"asd"},{"blockNum":2,"timestamp":1537462887,"previousHash":"87d070b812b19b622abbac3213052b483872d39878bc091e83c9e744b09a1e83","hash":"c78cddf669fbc8faeb22c1eaaf328a92c2b256affc2c7214668d93ef88c7a2c4","data":"asd"}]%
=> curl localhost:8081/blocks/all
[{"blockNum":0,"timestamp":0,"previousHash":"0x0","hash":"c0d73c5c2ef1da9272e19e41c9d37ec7723b9092e5998ec3240d81a00ae7cb89","data":"genesis block"},{"blockNum":1,"timestamp":1537462857,"previousHash":"c0d73c5c2ef1da9272e19e41c9d37ec7723b9092e5998ec3240d81a00ae7cb89","hash":"87d070b812b19b622abbac3213052b483872d39878bc091e83c9e744b09a1e83","data":"asd"},{"blockNum":2,"timestamp":1537462887,"previousHash":"87d070b812b19b622abbac3213052b483872d39878bc091e83c9e744b09a1e83","hash":"c78cddf669fbc8faeb22c1eaaf328a92c2b256affc2c7214668d93ef88c7a2c4","data":"asd"}]%

```
