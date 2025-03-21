
pragma solidity ^0.8.0;

contract ResumeVerification {
 
    struct Resume {
        bytes32 resumeHash;
        uint256 timestamp;
    }
    
   
    mapping(address => Resume[]) public resumeHistory;
 
    event ResumeAdded(address indexed user, bytes32 resumeHash, uint256 timestamp);
    
  
    function addResume(bytes32 _resumeHash) public {
        resumeHistory[msg.sender].push(Resume(_resumeHash, block.timestamp));
        emit ResumeAdded(msg.sender, _resumeHash, block.timestamp);
    }
    

    function getResumeHistory(address user) public view returns (Resume[] memory) {
        return resumeHistory[user];
    }

    function getLatestResume(address user) public view returns (Resume memory) {
        Resume[] memory history = resumeHistory[user];
        require(history.length > 0, "No resume history found");
        return history[history.length - 1];
    }
   
    function verifyResume(address user, bytes32 _resumeHash) public view returns (bool, uint256) {
        Resume[] memory history = resumeHistory[user];
        
        for (uint i = 0; i < history.length; i++) {
            if (history[i].resumeHash == _resumeHash) {
                return (true, history[i].timestamp);
            }
        }
        
        return (false, 0);
    }
}

