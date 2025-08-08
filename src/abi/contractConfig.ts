import YdTokenABI from './YdToken.json'
import YdCourseABI from './YdCourse.json'
import MiniNFTABI from './MiniNFT.json'


//购买YD token
export const YDTOKEN_CONTRACT = {
    address: "0xF342495D353A8219E29825704Be6EC943164945d",
    abi: YdTokenABI.abi
} as const;

//购买课程
export const YDCOURSE_CONTRACT = {
    address: "0xBa91cd76B3FAb4488f6A723a3Ef2e17F15fb0141",
    abi: YdCourseABI.abi
} as const;

//MiniNFT (NFT铸造) 
export const NFT_CONTRACT = {
    address: "0xA5D8A90eC35da000Dd432CecE8D7F2CA14cEbb0f",
    abi: MiniNFTABI.abi
} as const; 
