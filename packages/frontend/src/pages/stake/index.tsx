import { Button } from 'components/Button/Button'
import { useState, useEffect, useCallback } from 'react'
import { AppPage, Heading, MoneyInput, Layout } from '^@components'
import { Permissions } from '^@services/permissions'
import { StakeItem, TabItem } from 'components/pages/stake'
import  useMetaMask  from '../../hooks/useMetaMask'
import { ethers } from "ethers";
import tokenartifact from 'abis/baseabi.json'
import stakingartifact from 'abis/staking.json'

/**
 * Tab state
 */
enum Tab {
  stake,
  unstake,
}


const Stake = () => {
  const [tab, setTab] = useState<Tab>(Tab.stake)
  const [value, setValue] = useState<number | null>(null)

  const [baseBalance, setbaseBalance] = useState<number | null>(0)
  const [rebaseBalance, setrebaseBalance] = useState<number | null>(0)

  const [approved, setApproved] = useState<boolean>(false)


  const { isActive } = useMetaMask();

  useEffect(() => {
    checkApproved()
    getBalances()
  },)

  const getBalances = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const basecollectionAddress : string = '' // baseocollection contract address
    const rebasecollectionAddress : string = '' // rebasecollection contract address
    const stakingcontractAddress : string = '' // staking contract address


    const signer = provider.getSigner(0) 

    if(isActive) {
      const baseNFT = new ethers.Contract(
          basecollectionAddress,
          tokenartifact,
          signer
      );      
      const addr : string = await signer.getAddress() // Get the user account address

      const NFTbalance0 : string = await baseNFT.balanceOf(addr, 0);
      const NFTbalance1 : string = await baseNFT.balanceOf(addr, 1);
      const NFTbalance2 : string = await baseNFT.balanceOf(addr, 2);
      const NFTbalance3 : string = await baseNFT.balanceOf(addr, 3);
      const basetotal : number = parseInt(NFTbalance0) + parseInt(NFTbalance1) + parseInt(NFTbalance2) + parseInt(NFTbalance3)

      // const rebaseNFT = new ethers.Contract(
      //   rebasecollectionAddress,
      //   tokenartifact,
      //   signer
      // );      

      // const reNFTbalance0 : string = await rebaseNFT.balanceOf(stakingcontractAddress, 0);
      // const reNFTbalance1 : string = await rebaseNFT.balanceOf(stakingcontractAddress, 1);
      // const reNFTbalance2 : string = await rebaseNFT.balanceOf(stakingcontractAddress, 2);
      // const reNFTbalance3 : string = await rebaseNFT.balanceOf(stakingcontractAddress, 3);
      // const rebasetotal : number = parseInt(reNFTbalance0) + parseInt(reNFTbalance1) + parseInt(reNFTbalance2) + parseInt(reNFTbalance3)

      setbaseBalance(basetotal)
      //setrebaseBalance(rebasetotal)
    }
}
  //checks acoount if approved for the basecollection contract
  const checkApproved = async () => {

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const basecollectionAddress : string = '' // basecollection contact address
    const stakingcontractAddress : string = ''

    const signer = provider.getSigner(0) 

    if(isActive) {
      const token = new ethers.Contract(
        basecollectionAddress,
        tokenartifact,
        signer
      );

      const addr : string = await signer.getAddress() // Get the user account address
      
      const approval = await token.isApprovedForAll(addr, stakingcontractAddress)
      
      if(approval) {
        localStorage.setItem("approved", "true");
        setApproved(true)
      } else {
        localStorage.setItem("approved", "false");

      }
      
    }
    
  }

  //approves account for the staking contract
  const approve = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const basecollectionAddress : string = '' // basecollection contact address
    const stakingcontractAddress : string = '' //staking contract address
    
    const signer = provider.getSigner(0)

    const token = new ethers.Contract(
      basecollectionAddress,
      tokenartifact,
      signer
    );
    
    const approval = await token.setApprovalForAll(stakingcontractAddress, true)
    localStorage.setItem("approved", "true");
    setApproved(true)
  }

  const stake = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const stakingcontract : string = '' // staking contact address

    const signer = provider.getSigner(0)

    const token = new ethers.Contract(
      stakingcontract,
      stakingartifact,
      signer
    );
        
    const stake = await token.stake(value, 3)
    
  }

  const unstake = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const stakingcontract : string = '' // staking contact address

    const signer = provider.getSigner(0)

    const token = new ethers.Contract(
      stakingcontract,
      stakingartifact,
      signer
    );
        
    const stake = await token.unstake(value, 3)
    
  }

  return (
    <Layout showConnectWallet >
      <div className="flex flex-col w-full bg-gray-100 p-8 rounded">
        <Heading text="Stake" />
        <h3 className="text-xs leading-4 font-medium tracking-wider uppercase">
          7 HOURS 49 MINUTES TO NEXT REBASE
        </h3>

        <div className="flex justify-center mb-4">
          <TabItem onClick={() => setTab(Tab.stake)} active={tab === Tab.stake}>
            Stake
          </TabItem>
          <TabItem
            onClick={() => setTab(Tab.unstake)}
            active={tab === Tab.unstake}
          >
            Unstake
          </TabItem>
        </div>

        <div className="flex">
          <MoneyInput
            max={1000}
            value={value}
            className="flex-1 mr-4" //{(isActive && approved) ? "Stake" : "Approve"} 
            onInputChange={(number) => setValue(number)}
          /> 
          <Button text= {(isActive && approved) ? ((tab === Tab.stake) ? "Stake" : "Unstake") : "Approve"} height="h-full" disabled={(!isActive || (approved && !value))} onClick={(isActive && approved) ? ((tab === Tab.stake) ? stake : unstake) : approve} />
        </div>

        <span className="text-sm leading-5 font-normal text-gray-600 mt-2">
          Note: The "Approve" transaction is only needed when staking/unstaking
          for the first time; subsequent staking/unstaking only requires you to
          perform the "Stake" or "Unstake" transaction.
        </span>

        <div className="mt-4">
          <StakeItem text="Your Balance" balance={baseBalance} />
          <StakeItem text="Your Staked Balance" balance={rebaseBalance} />
          <StakeItem text="Next Reward Amount" balance={0} />
          <StakeItem text="Your Reward Yield" balance={0} />
        </div>
      </div>
    </Layout>
  )
}

export default AppPage(Stake, { permission: Permissions.PUBLIC })
