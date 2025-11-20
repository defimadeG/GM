const CONTRACT_ADDRESS = "0xdCD2F10a047EA29ae6C879812819d30070CD67CF"; 

const CONTRACT_ABI = [
  "function greet() view returns (string)",
  "function setGreeting(string _greeting)"
];

let provider;
let signer;
let contract;

function elementOrThrow(id) {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing element with id="${id}" in HTML`);
  return el;
}

document.addEventListener("DOMContentLoaded", () => {
  // Ensure required DOM elements exist
  elementOrThrow("connectWalletButton");
  elementOrThrow("currentGreeting");
  elementOrThrow("newGreeting");
  elementOrThrow("setGreetingButton");

  document.getElementById("connectWalletButton").onclick = connectWallet;
  document.getElementById("setGreetingButton").onclick = setGreeting;
});

async function connectWallet() {
  try {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }


    await window.ethereum.request({ method: "eth_requestAccounts" });

    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();

    // Create contract instance with signer so we can send transactions
    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    alert("Wallet connected!");
    await loadGreeting();
  } catch (error) {
    console.error("connectWallet error:", error);
    alert("Failed to connect wallet. Check console for details.");
  }
}

async function loadGreeting() {
  if (!contract) {
    document.getElementById("currentGreeting").innerText = "Not connected";
    return;
  }
  try {
    const current = await contract.greet();
    document.getElementById("currentGreeting").innerText = current;
  } catch (error) {
    console.error("loadGreeting error:", error);
    document.getElementById("currentGreeting").innerText = "Error fetching greeting";
  }
}

async function setGreeting() {
  if (!contract) {
    alert("Please connect your wallet first!");
    return;
  }

  const newGreeting = document.getElementById("newGreeting").value.trim();
  if (!newGreeting) {
    alert("Enter a greeting first!");
    return;
  }

  try {
    // Send transaction via signer-backed contract
    const txResponse = await contract.setGreeting(newGreeting);
    console.log("Tx submitted:", txResponse);
    // Wait for the transaction to be mined
    const receipt = await txResponse.wait();
    console.log("Tx mined:", receipt);
    alert("Greeting updated!");
    await loadGreeting();
    document.getElementById("newGreeting").value = "";
  } catch (error) {
    console.error("setGreeting error:", error);
    // Helpful user-level messages for common cases:
    if (error.code === 4001) { // MetaMask user rejected
      alert("Transaction rejected by user.");
    } else {
      alert("Failed to update greeting. Check console for details.");
    }
  }
}
