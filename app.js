// Replace with your deployed contract address
const CONTRACT_ADDRESS = "0xdCD2F10a047EA29ae6C879812819d30070CD67CF";

// ABI of the contract
const CONTRACT_ABI = [
    "function greet() view returns (string)",
    "function setGreeting(string _greeting)"
];

let provider;
let signer;
let contract;

// Connect wallet
document.getElementById("connectWalletButton").onclick = async () => {
    if (!window.ethereum) return alert("Please install MetaMask!");
    provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner();
    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    alert("Wallet connected!");
    loadGreeting();
};

// Load current greeting
async function loadGreeting() {
    if (!contract) return;
    const current = await contract.greet();
    document.getElementById("currentGreeting").innerText = current;
}

// Set new greeting
document.getElementById("setGreetingButton").onclick = async () => {
    const newGreeting = document.getElementById("newGreeting").value;
    if (!newGreeting) return alert("Enter a greeting first!");
    const tx = await contract.setGreeting(newGreeting);
    await tx.wait();
    alert("Greeting updated!");
    loadGreeting();
};
