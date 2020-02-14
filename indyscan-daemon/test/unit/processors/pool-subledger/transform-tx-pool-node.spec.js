/* eslint-env jest */
const txNode = require('indyscan-storage/test/resource/sample-txs/tx-pool-node')
const _ = require('lodash')
const {createProcessorExpansion} = require('../../../../src/processors/processor-expansion')

let processor = createProcessorExpansion({id:'foo', sourceLookups: undefined})

const POOL_LEDGER_ID = '0'

describe('pool/node transaction transformations', () => {
  it('should add typeName and subledger for pool NODE transaction', async () => {
    const tx = _.cloneDeep(txNode)
    const {processedTx}  = await processor.processTx(tx, 'POOL')
    expect(JSON.stringify(tx)).toBe(JSON.stringify(txNode))
    expect(processedTx.txn.typeName).toBe('NODE')
    expect(processedTx.subledger.code).toBe(POOL_LEDGER_ID)
    expect(processedTx.subledger.name).toBe('POOL')
    expect(processedTx.txnMetadata.txnTime).toBe('2019-11-08T21:40:59.000Z')
    expect(processedTx.txn.data.data.client_ip_geo.country).toBe('US')
    expect(processedTx.txn.data.data.client_ip_geo.region).toBe('VA')
    expect(processedTx.txn.data.data.client_ip_geo.eu).toBe(false)
    expect(processedTx.txn.data.data.client_ip_geo.timezone).toBe('America/New_York')
    expect(processedTx.txn.data.data.client_ip_geo.city).toBe('Ashburn')
    expect(processedTx.txn.data.data.client_ip_geo.location.lat.toString()).toContain(39.018.toString())
    expect(processedTx.txn.data.data.client_ip_geo.location.lon.toString()).toContain(-77.539.toString())

    expect(processedTx.txn.data.data.node_ip_geo.country).toBe('US')
    expect(processedTx.txn.data.data.node_ip_geo.region).toBe('VA')
    expect(processedTx.txn.data.data.node_ip_geo.eu).toBe(false)
    expect(processedTx.txn.data.data.node_ip_geo.timezone).toBe('America/New_York')
    expect(processedTx.txn.data.data.node_ip_geo.city).toBe('Ashburn')
    expect(processedTx.txn.data.data.node_ip_geo.location.lat.toString()).toContain(39.018.toString())
    expect(processedTx.txn.data.data.node_ip_geo.location.lon.toString()).toContain(-77.539.toString())
  })
})