import { describe, expect, it } from 'vitest'
import { TYPERT_REMOTE } from '../src/remote.ts'

describe('session-resume Remote descriptor', () => {
  it('publishes the standalone namespace and takeover operations', () => {
    expect(TYPERT_REMOTE.package).toBe('dsh-assembly.resume')
    expect(TYPERT_REMOTE.descriptors.map(descriptor => descriptor.method)).toEqual([
      'discover', 'takeOverStandalone', 'takeOver', 'open', 'list', 'detach',
    ])
    expect(TYPERT_REMOTE.descriptors.find(descriptor => descriptor.method === 'discover')).toMatchObject({
      service: 'sessionResume',
      namespace: 'sessionResume',
    })
    expect(TYPERT_REMOTE.descriptors.find(descriptor => descriptor.method === 'discover')?.scope).toBeUndefined()
    expect(TYPERT_REMOTE.descriptors.find(descriptor => descriptor.method === 'takeOverStandalone')?.scope).toBeUndefined()
    for (const descriptor of TYPERT_REMOTE.descriptors.filter(descriptor => descriptor.method !== 'discover' && descriptor.method !== 'takeOverStandalone')) {
      expect(descriptor.scope).toEqual({ context: 'agent', wire: 'agentId' })
    }
  })

  it('provides a create factory on strict codecs for DSH typert-loader compatibility', () => {
    for (const descriptor of TYPERT_REMOTE.descriptors) {
      if (descriptor.result?.mode === 'strict') {
        expect(typeof (descriptor.result as { create?: unknown }).create).toBe('function')
      }
      for (const param of descriptor.parameters) {
        if (param.codec?.mode === 'strict') {
          expect(typeof (param.codec as { create?: unknown }).create).toBe('function')
        }
      }
    }
  })
})

