import defaultTokenList from '@uniswap/default-token-list'

import fetchTokenList from './fetchTokenList'

describe('fetchTokenList', () => {
  const resolver = jest.fn()
  beforeEach(() => resolver.mockReset())

  it('throws on an invalid list url', async () => {
    const url = 'https://example.com/invalid-tokenlist.json'
    fetchMock.mockIf(url, () => {
      throw new Error()
    })
    await expect(fetchTokenList(url, resolver)).rejects.toThrowError(`failed to fetch list: ${url}`)
    expect(resolver).not.toHaveBeenCalled()
  })

  it('tries to fetch an ENS address using the passed resolver', async () => {
    const url = 'example.eth'
    const contenthash = '0xD3ADB33F'
    resolver.mockResolvedValue(contenthash)
    await expect(fetchTokenList(url, resolver)).rejects.toThrow(
      `failed to translate contenthash to URI: ${contenthash}`
    )
    expect(resolver).toHaveBeenCalledWith(url)
  })

  it('fetches and validates the default token list', async () => {
    const url = 'https://example.com/default-tokenlist.json'
    fetchMock.mockIf(url, () => Promise.resolve(JSON.stringify(defaultTokenList)))
    await expect(fetchTokenList(url, resolver)).resolves.toStrictEqual(defaultTokenList)
    expect(resolver).not.toHaveBeenCalled()
  })
})
