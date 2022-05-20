/*
Copyright 2018 - 2022 The Alephium Authors
This file is part of the alephium project.

The library is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

The library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with the library. If not, see <http://www.gnu.org/licenses/>.
*/

import { NodeProvider } from '../src/api'
import { Contract, Script, TestContractParams } from '../src/contract'
import { testWallet } from '../src/test'

import addJson from '../artifacts/add.ral.json'
import subJson from '../artifacts/sub.ral.json'
import mainJson from '../artifacts/main.ral.json'
import greeterJson from '../artifacts/greeter.ral.json'
import greeterMainJson from '../artifacts/greeter_main.ral.json'

describe('contract', function () {
  async function testSuite1() {
    const provider = new NodeProvider('http://127.0.0.1:22973')

    const add = await Contract.fromSource(provider, 'add.ral')
    const sub = await Contract.fromSource(provider, 'sub.ral')

    const subState = sub.toState({ result: 0 }, { alphAmount: BigInt('1000000000000000000') })
    const testParams: TestContractParams = {
      initialFields: { subContractId: subState.contractId, result: 0 },
      testArgs: { array: [2, 1] },
      existingContracts: [subState]
    }
    const testResult = await add.testPublicMethod(provider, 'add', testParams)
    expect(testResult.returns).toEqual([[3, 1]])
    expect(testResult.contracts[0].codeHash).toEqual(sub.codeHash)
    expect(testResult.contracts[0].fields.result).toEqual(1)
    expect(testResult.contracts[1].codeHash).toEqual(add.codeHash)
    expect(testResult.contracts[1].fields.subContractId).toEqual(subState.contractId)
    expect(testResult.contracts[1].fields.result).toEqual(3)
    const events = testResult.events.sort((a, b) => a.name.localeCompare(b.name))
    expect(events[0].name).toEqual('Add')
    expect(events[0].fields.x).toEqual(2)
    expect(events[0].fields.y).toEqual(1)
    expect(events[1].name).toEqual('Sub')
    expect(events[1].fields.x).toEqual(2)
    expect(events[1].fields.y).toEqual(1)

    const testResultPrivate = await add.testPrivateMethod(provider, 'addPrivate', testParams)
    expect(testResultPrivate.returns).toEqual([[3, 1]])

    const signer = await testWallet(provider)

    const subDeployTx = await sub.transactionForDeployment(signer, { initialFields: { result: 0 } })
    const subContractId = subDeployTx.contractId
    expect(subDeployTx.fromGroup).toEqual(0)
    expect(subDeployTx.toGroup).toEqual(0)
    const subSubmitResult = await signer.submitTransaction(subDeployTx.unsignedTx, subDeployTx.txId)
    expect(subSubmitResult.fromGroup).toEqual(0)
    expect(subSubmitResult.toGroup).toEqual(0)
    expect(subSubmitResult.txId).toEqual(subDeployTx.txId)

    const addDeployTx = await add.transactionForDeployment(signer, {
      initialFields: { subContractId: subContractId, result: 0 }
    })
    expect(addDeployTx.fromGroup).toEqual(0)
    expect(addDeployTx.toGroup).toEqual(0)
    const addSubmitResult = await signer.submitTransaction(addDeployTx.unsignedTx, addDeployTx.txId)
    expect(addSubmitResult.fromGroup).toEqual(0)
    expect(addSubmitResult.toGroup).toEqual(0)
    expect(addSubmitResult.txId).toEqual(addDeployTx.txId)

    const addContractId = addDeployTx.contractId
    const main = await Script.fromSource(provider, 'main.ral')

    const mainScriptTx = await main.transactionForDeployment(signer, {
      initialFields: { addContractId: addContractId }
    })
    expect(mainScriptTx.fromGroup).toEqual(0)
    expect(mainScriptTx.toGroup).toEqual(0)
    const mainSubmitResult = await signer.submitTransaction(mainScriptTx.unsignedTx, mainScriptTx.txId)
    expect(mainSubmitResult.fromGroup).toEqual(0)
    expect(mainSubmitResult.toGroup).toEqual(0)
  }

  async function testSuite2() {
    const provider = new NodeProvider('http://127.0.0.1:22973')

    const greeter = await Contract.fromSource(provider, 'greeter.ral')

    const testParams: TestContractParams = {
      initialFields: { btcPrice: 1 }
    }
    const testResult = await greeter.testPublicMethod(provider, 'greet', testParams)
    expect(testResult.returns).toEqual([1])
    expect(testResult.contracts[0].codeHash).toEqual(greeter.codeHash)
    expect(testResult.contracts[0].fields.btcPrice).toEqual(1)

    const signer = await testWallet(provider)

    const deployTx = await greeter.transactionForDeployment(signer, { initialFields: { btcPrice: 1 } })
    expect(deployTx.fromGroup).toEqual(0)
    expect(deployTx.toGroup).toEqual(0)
    const submitResult = await signer.submitTransaction(deployTx.unsignedTx, deployTx.txId)
    expect(submitResult.fromGroup).toEqual(0)
    expect(submitResult.toGroup).toEqual(0)
    expect(submitResult.txId).toEqual(deployTx.txId)

    const greeterContractId = deployTx.contractId
    const main = await Script.fromSource(provider, 'greeter_main.ral')

    const mainScriptTx = await main.transactionForDeployment(signer, {
      initialFields: { greeterContractId: greeterContractId }
    })
    expect(mainScriptTx.fromGroup).toEqual(0)
    expect(mainScriptTx.toGroup).toEqual(0)
    const mainSubmitResult = await signer.submitTransaction(mainScriptTx.unsignedTx, mainScriptTx.txId)
    expect(mainSubmitResult.fromGroup).toEqual(0)
    expect(mainSubmitResult.toGroup).toEqual(0)
  }

  it('should test contracts', async () => {
    await testSuite1()
    await testSuite2()
  })

  it('should load contract from json', async () => {
    Contract.fromJson(addJson)
    Contract.fromJson(subJson)
    Contract.fromJson(greeterJson)
    Script.fromJson(mainJson)
    Script.fromJson(greeterMainJson)
  })
})
