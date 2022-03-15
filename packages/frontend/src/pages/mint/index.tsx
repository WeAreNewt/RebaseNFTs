import Image from 'next/image'
import { useState } from 'react'
import { ethers } from "ethers";
import tokenartifact from '../../baseabi.json'
import { AppPage, Layout, MoneyInput, Heading, Button } from '^@components'
import { Permissions } from '^@services/permissions'
import  useMetaMask  from '../../hooks/useMetaMask'

const Mint = () => {

  const [value, setValue] = useState<number>()
  const { isActive } = useMetaMask();

  const mint = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contractAddress = '' //basecollection contract address here

    const signer = provider.getSigner(0)
    const addr : string = await signer.getAddress()
    const token = new ethers.Contract(
      contractAddress,
      tokenartifact,
      signer
    );
    
    const mintnft = await token.mint(addr,1,value,'0x00')
  }

  return (
  <Layout showConnectWallet>
    <div className="flex flex-col justify-center items-center">
      <div className="flex justify-center">
        <Image src="/images/ricco-1.png" width={300} height={300} />
        <Image src="/images/ricco-2.png" width={300} height={300} />
      </div>
      <h1 className="text-6xl leading-none font-extrabold mb-4">
        Mint!
      </h1>
      <h2 className="text-4xl leading-10 font-normal mb-4">9990/9999 minted</h2>
    </div>

      <div className="flex flex-col w-full bg-gray-100 p-8 rounded">
        <Heading text="Mint" />
        
        <div className="flex">
          <MoneyInput
            max={1000}
            value={value}
            onInputChange={(number) => setValue(number)}
            className="flex-1 mr-4"
          />
          <Button text="Mint" height="h-full" disabled={isActive ? false : true} onClick={mint} />
        </div>

        <span className="text-sm leading-5 font-normal text-gray-600 mt-2">
          Note: Mint your NFT here
        </span>

      </div>
  </Layout>
)
  }
export default AppPage(Mint, { permission: Permissions.PUBLIC })
