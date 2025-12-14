import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import path from 'path'

const PROTO_PATH = '/home/paul/go/src/github.com/EdgeApp/react-native-hush/scripts/protos/zcash/service.proto'
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

async function testMethods() {
  console.log('Testing HUSH lightwalletd at', SERVER)
  console.log('=' .repeat(50))

  // Test 1: GetLightdInfo
  console.log('\n1. GetLightdInfo:')
  client.GetLightdInfo({}, (err: any, response: any) => {
    if (err) {
      console.log('   ERROR:', err.message)
    } else {
      console.log('   Version:', response.version)
      console.log('   Vendor:', response.vendor)
      console.log('   Chain:', response.chainName)
      console.log('   Block Height:', response.blockHeight)
      console.log('   Sapling Height:', response.saplingActivationHeight)
    }
  })

  // Test 2: GetLatestBlock
  setTimeout(() => {
    console.log('\n2. GetLatestBlock:')
    client.GetLatestBlock({}, (err: any, response: any) => {
      if (err) {
        console.log('   ERROR:', err.message)
      } else {
        console.log('   Height:', response.height)
        console.log('   Hash:', response.hash?.toString('hex')?.slice(0, 32) + '...')
      }
    })
  }, 1000)

  // Test 3: GetBlock (block 1)
  setTimeout(() => {
    console.log('\n3. GetBlock (height=1):')
    client.GetBlock({ height: 1 }, (err: any, response: any) => {
      if (err) {
        console.log('   ERROR:', err.message)
      } else {
        console.log('   Height:', response.height)
        console.log('   Hash:', response.hash?.toString('hex')?.slice(0, 32) + '...')
        console.log('   Time:', response.time)
      }
    })
  }, 2000)

  // Test 4: GetCoinsupply
  setTimeout(() => {
    console.log('\n4. GetCoinsupply:')
    client.GetCoinsupply({}, (err: any, response: any) => {
      if (err) {
        console.log('   ERROR:', err.message)
      } else {
        console.log('   Coin:', response.coin)
        console.log('   Height:', response.height)
        console.log('   Supply:', response.supply)
        console.log('   Total:', response.total)
      }
    })
  }, 3000)

  // Test 5: GetTreeState (likely to fail)
  setTimeout(() => {
    console.log('\n5. GetTreeState (height=100000):')
    client.GetTreeState({ height: 100000 }, (err: any, response: any) => {
      if (err) {
        console.log('   ERROR:', err.message)
      } else {
        console.log('   Network:', response.network)
        console.log('   Height:', response.height)
      }
    })
  }, 4000)

  setTimeout(() => {
    console.log('\n' + '='.repeat(50))
    console.log('Testing complete')
    process.exit(0)
  }, 6000)
}

testMethods()
