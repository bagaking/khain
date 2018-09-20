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