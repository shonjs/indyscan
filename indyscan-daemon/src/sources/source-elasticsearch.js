const logger = require('../logging/logger-main')
const {createStorageReadEs} = require('indyscan-storage')
const {Client} = require('@elastic/elasticsearch')

async function createSourceElasticsearch ({id, url, index}) {
  const esClient = new Client({node: url})
  const storageRead = createStorageReadEs(esClient, index, logger)

  async function getTxData (subledger, seqNo, format) {
    const queryFormat = (format === 'original') ? 'serialized' : format
    const result = await storageRead.getOneTx(subledger, seqNo, queryFormat) // eslint-disable-line
    if (!result) {
      return undefined
    }
    const {idata, imeta} = result
    if (!idata || !imeta) {
      throw Error(`Received a response from storage, but idata or imeta was undefined.`)
    }
    if (format === 'original') {
      if (queryFormat === 'serialized') {
        return JSON.parse(idata.json)
      } else {
        throw Error(`Assumptions on code above broke. If user requested "original", query should had been queried for "serialized".`)
      }
    }
    return idata
  }

  async function getHighestSeqno (subledger, format) {
    return storageRead.findMaxSeqNo(subledger, format)
  }

  function getObjectId () {
    return id
  }

  return {
    getObjectId,
    getTxData,
    getHighestSeqno
  }
}

module.exports.createSourceElasticsearch = createSourceElasticsearch
