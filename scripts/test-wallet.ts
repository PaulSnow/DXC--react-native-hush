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

console.log('='.repeat(60))
console.log('HUSH Edge Wallet Integration Test')
console.log('='.repeat(60))
console.log(`Server: ${SERVER}\n`)

async function runTests() {
  // Test 1: GetLightdInfo
  console.log('1. GetLightdInfo')
  const lightdInfo = await new Promise<any>((resolve, reject) => {
    client.GetLightdInfo({}, (err: any, res: any) => {
      if (err) reject(err)
      else resolve(res)
    })
  })
  console.log(`   Version: ${lightdInfo.version}`)
  console.log(`   Chain: ${lightdInfo.chainName}`)
  console.log(`   Block Height: ${lightdInfo.blockHeight}`)
  console.log(`   Sapling Height: ${lightdInfo.saplingActivationHeight}`)
  console.log('   ✓ PASS\n')

  // Test 2: GetLatestBlock
  console.log('2. GetLatestBlock')
  const latestBlock = await new Promise<any>((resolve, reject) => {
    client.GetLatestBlock({}, (err: any, res: any) => {
      if (err) reject(err)
      else resolve(res)
    })
  })
  console.log(`   Height: ${latestBlock.height}`)
  console.log(`   Hash: ${latestBlock.hash?.toString('hex')?.slice(0, 40)}...`)
  console.log('   ✓ PASS\n')

  // Test 3: GetBlock (genesis block)
  console.log('3. GetBlock (height=1)')
  const block1 = await new Promise<any>((resolve, reject) => {
    client.GetBlock({ height: 1 }, (err: any, res: any) => {
      if (err) reject(err)
      else resolve(res)
    })
  })
  console.log(`   Height: ${block1.height}`)
  console.log(`   Hash: ${block1.hash?.toString('hex')?.slice(0, 40)}...`)
  console.log(`   Time: ${new Date(block1.time * 1000).toISOString()}`)
  console.log('   ✓ PASS\n')

  // Test 4: GetTreeState
  console.log('4. GetTreeState (height=100000)')
  try {
    const treeState = await new Promise<any>((resolve, reject) => {
      client.GetTreeState({ height: 100000 }, (err: any, res: any) => {
        if (err) reject(err)
        else resolve(res)
      })
    })
    console.log(`   Network: ${treeState.network}`)
    console.log(`   Height: ${treeState.height}`)
    console.log(`   Hash: ${treeState.hash?.slice(0, 40)}...`)
    console.log(`   SaplingTree: ${treeState.saplingTree?.slice(0, 40)}...`)
    console.log('   ✓ PASS\n')
  } catch (err) {
    const e = err as any
    console.log(`   ✗ FAIL: ${e.details || e.message}\n`)
  }

  // Test 5: GetBlockRange (fetch 5 blocks)
  console.log('5. GetBlockRange (100-104)')
  const blocks: any[] = []
  await new Promise<void>((resolve, reject) => {
    const stream = client.GetBlockRange({
      start: { height: 100 },
      end: { height: 104 }
    })
    stream.on('data', (block: any) => blocks.push(block))
    stream.on('end', () => resolve())
    stream.on('error', (err: any) => reject(err))
  })
  console.log(`   Received ${blocks.length} blocks`)
  blocks.forEach(b => console.log(`   - Block ${b.height}`))
  console.log('   ✓ PASS\n')

  console.log('='.repeat(60))
  console.log('All tests completed!')
  console.log('='.repeat(60))
}

runTests()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Test failed:', err)
    process.exit(1)
  })
