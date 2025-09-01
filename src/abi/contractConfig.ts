import YdTokenABI from './YdToken.json'
import YdCourseABI from './YdCourse.json'
import MiniNFTABI from './MiniNFT.json'


//购买YD token
export const YDTOKEN_CONTRACT = {
    address: "0x8FeC745D6fa25355642BC22716fC37EDcC4a85d5",
    abi: YdTokenABI.abi
} as const;

//购买课程
export const YDCOURSE_CONTRACT = {
    address: "0xFE2EF4fEb0AD28c0550B710E7bc34D623c217cD1",
    abi: YdCourseABI.abi
} as const;

//MiniNFT (NFT铸造) 
export const NFT_CONTRACT = {
    address: "0x6a976939a0a034EFdF58797168DA9A08e0BcE07C",
    abi: MiniNFTABI.abi
} as const; 
