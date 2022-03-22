import Image from 'next/image'
import { useState } from 'react'
import { ethers } from "ethers";
import tokenartifact from '../../baseabi.json'
import { AppPage, Layout, MoneyInput, Heading, Button, Slider, ConnectWalletButton } from '^@components'
import { Permissions } from '^@services/permissions'
import  useMetaMask  from '../../hooks/useMetaMask'


const Mint = () => {

  const [value, setValue] = useState<number>(1)
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
      
      <h1 className="text-6xl leading-none font-extrabold mb-4 ">
        Mint! It's Free!
      </h1>
      
      <h2 className="text-4xl leading-10 font-normal mb-4">9990/9999 minted</h2>
      
    </div>
    <div> 
      
      {isActive ? 

      (
        <div>
          <div className="flex flex-row w-full p-8 rounded space-x-4 place-items-center justify-center">
        
        <div className="flex flex-col w-96 accent-black">
          <Slider value={value} onInputChange={(value) => setValue(value)}/>
        </div>
        

        <div className="flex flex-row static right-0 float-right">
          <h1>{value} Rabbits</h1>
        </div>
      
      </div>
      <div className = "flex flex-col justify-center items-center">
          <Button text="Mint" height="h-full" disabled={isActive ? false : true} onClick={mint} />
      </div>
           
        </div>
      ) : 
      (
        <div className = "flex flex-col justify-center items-center">
          <ConnectWalletButton />
        </div>
      )}


      

      </div>
  </Layout>
)
  }
export default AppPage(Mint, { permission: Permissions.PUBLIC })
