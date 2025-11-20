// Replace with your deployed contract address
const CONTRACT_ADDRESS = "0xdCD2F10a047EA29ae6C879812819d30070CD67CF";

// Contract ABI
const CONTRACT_ABI = [
    "function greet() view returns (string)",
    "function setGreeting(string _greeting)"
];

let provider;
let signer;
let contract;

// Connect wallet
document.getElementById("connectWalletButton").onclick = async () => {
    try {
        if (!window.ethereum) return alert("Please install MetaMask!");
        
        // Create provider and signer
        provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = await provider.getSigner();
        
        // Initialize contract instance
        contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

        alert("Wallet connected!");
        loadGreeting(); // Load current greeting after connection
    } catch (error) {
        console.error(error);
        alert("Failed to connect wallet. Check console for details.");
    }
};

// Load current greeting
async function loadGreeting() {
    if (!contract) return;
    try {
        const current = await contract.greet();
        document.getElementById("currentGreeting").innerText = current;
    } catch (error) {
        console.error(error);
        document.getElementById("currentGreeting").innerText = "Error fetching greeting";
    }
}

// Set new greeting
document.getElementById("setGreetingButton").onclick = async () => {
    if (!contract) return alert("Please connect your wallet first!");

    const newGreeting = document.getElementById("newGreeting").value;
    if (!newGreeting) return alert("Enter a greeting first!");

    try {
        const tx = await contract.setGreeting(newGreeting);
        await tx.wait(); // Wait for transaction to be mined
        alert("Greeting updated!");
        loadGreeting(); // Reload current greeting
        document.getElementById("newGreeting").value = ""; // Clear input
    } catch (error) {
        console.error(error);
        alert("Failed to update greeting. Check console for details.");
    }
};
