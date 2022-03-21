import { InjectedConnector } from "@web3-react/injected-connector";

export const supportedChainIds = [
  // Avalanche Network
  // https://support.avax.network/en/articles/4626956-how-do-i-set-up-metamask-on-avalanche
  43114,
]

export const injectedConnector = new InjectedConnector({
    supportedChainIds: supportedChainIds
})
