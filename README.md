## Inspiration
Our inspiration was to develop a decentralized, creator-centric platform for content monetization. We sought to design a Web-3 application as an alternative to current content monetization platforms like Patreon. 

## What it does

Our platform, Block Bazaar, lacks the downfalls of traditional content platforms, which have exorbitant fees and lack of true creator ownership/autonomy. The Sui Blockchain allows users to directly pay creators, directly gain access to the content, and for creators to directly receive their money with no middleman. Through smart contracts we achieve higher efficiency and reduce costs for all parties involved. Additionally, we encrypt content to protect a creator's work and decrypt that content for the user once they have paid for the content. 

The content on the platform can be a wide variety of subjects. Some examples could be photography, short stories and poems, data structures notes and much more! 

## How we built it

We built this platform as a standalone web app, which fully utilizes the Sui SDK to create backend logic with blockchain and self-executing smart contracts, as well as data storage and encryption solutions. We used smart contracts and blockchain to execute payments and manage access of assets in the platform. Further, we used Seal for data encryption and Walrus to store that data. The front end was built with Typescript, React and Tailwind CSS. 

## Challenges we ran into

One challenge we faced was debugging and trying to get pictures to load. 
Additionally having to integrate the sui command line tools was a pretty big roadblock since the suiup wouldn't download for us. 
The last major challenge was had was integrating Seal to encrypt our data. Sometimes the decryption process didn't work as expected. 

## Accomplishments that we're proud of

We are proud of :
- Utilizing many capabilities of a blockchain and applying it to a relevant use case. 
- Democratizing the content monetization process for creators of any audience size. 
- Working together to solve any challenges we faced and creating a product we enjoyed developing.

## What we learned
- Understanding how to use smart contracts in the language Move 
- Implementing Sui SDK in our app. 
- Aligning a Web3 backend with a traditional front-end in React/TS. 


## What's next for Block Bazaar

- Implement immutable on-chain royalties in the Move contract, ensuring creators earn a cut from every future secondary sale of their art.
- Develop Membership NFTs to enable creators to offer recurring, tiered content access, replacing the need for centralized subscriptions.
- Decentralize content and access by integrating with IPFS/Arweave for storage, tying the content decryption key to the user's wallet after successful on-chain purchase.
- enable our platform to handle long form videos such as streams, which have a large following. 