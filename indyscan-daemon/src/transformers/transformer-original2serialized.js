const logger = require('../logging/logger-main')
const { intializeEsTarget } = require('./target-inits')

function createTransformerOriginal2Serialized ({ indyNetworkId, operationId, componentId }) {
  const loggerMetadata = {
    metadaemon: {
      indyNetworkId,
      operationId,
      componentId,
      componentType: 'transformer-original2serialized'
    }
  }

  async function processTx (tx) {
    if (!tx) {
      throw Error('tx argument not defined')
    }
    const processedTx = { json: JSON.stringify(tx) }
    return { processedTx, format: getOutputFormat() }
  }

  function getOutputFormat () {
    return 'serialized'
  }

  function getElasticsearchTargetMappings () {
    return {
      'json': { type: 'text', index: false }
    }
  }

  async function initializeTarget (target) {
    logger.info(`Initializing target.`, loggerMetadata)
    return intializeEsTarget(target, getOutputFormat(), getElasticsearchTargetMappings())
  }

  function getObjectId () {
    return componentId
  }

  return {
    processTx,
    initializeTarget,
    getObjectId,
    getOutputFormat
  }
}

module.exports.createTransformerOriginal2Serialized = createTransformerOriginal2Serialized
