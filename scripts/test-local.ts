import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import path from 'path'

const PROTO_PATH = path.join(__dirname, 'protos/zcash/service.proto')
const SERVER = 'localhost:9067'

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
})

const proto: any = grpc.loadPackageDefinition(packageDefinition)
const client = new proto.cash.z.wallet.sdk.rpc.CompactTxStreamer(
  SERVER,
  grpc.credentials.createInsecure()
)

console.log('Testing local lightwalletd at localhost:9067...\n')

// Test GetLightdInfo
client.GetLightdInfo({}, (err: any, response: any) => {
  if (err) {
    console.log('GetLightdInfo ERROR:', err.message)
  } else {
    console.log('GetLightdInfo:')
    console.log('  Block Height:', response.blockHeight)
    console.log('  Sapling Height:', response.saplingActivationHeight)
  }

  // Test GetTreeState
  client.GetTreeState({ height: 1000 }, (err: any, response: any) => {
    if (err) {
      console.log('\nGetTreeState ERROR:', err.details || err.message)
    } else {
      console.log('\nGetTreeState SUCCESS:')
      console.log('  Height:', response.height)
      console.log('  Hash:', response.hash)
      console.log('  SaplingTree length:', response.saplingTree?.length || 0)
    }
    process.exit(0)
  })
})
