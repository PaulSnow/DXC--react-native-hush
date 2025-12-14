import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import path from 'path'

const PROTO_PATH = path.join(__dirname, 'protos/zcash/service.proto')
const SERVER = 'lite.hush.is:443'

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
  grpc.credentials.createSsl()
)

console.log('Testing GetTreeState on lite.hush.is:443...\n')

client.GetTreeState({ height: 100000 }, (err: any, response: any) => {
  if (err) {
    console.log('GetTreeState ERROR:', err.details || err.message)
    console.log('\nThis method is not implemented on the public server.')
    console.log('Checkpoints will need to be generated from a local server.')
  } else {
    console.log('GetTreeState SUCCESS:')
    console.log('  Network:', response.network)
    console.log('  Height:', response.height)
    console.log('  Hash:', response.hash)
    console.log('  SaplingTree:', response.saplingTree?.slice(0, 50) + '...')
  }
  process.exit(0)
})
