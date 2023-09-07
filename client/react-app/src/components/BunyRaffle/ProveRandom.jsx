import sloth from "./slothVDF";
import { ethers } from "ethers";

export default function ProveRandom() {
  async function main() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        randomAddress,
        RandomVDFv1.abi,
        signer,
      );
      const prime = BigInt((await contract.prime()).toString());
      const iterations = BigInt((await contract.iterations()).toNumber());
      console.log("prime", prime.toString());
      console.log("iterations", iterations.toString());
      // create a new seed
      const tx = await contract.createSeed();
      await tx.wait();
      // get the seed
      const seed = BigInt((await contract.seeds(signer.address)).toString());
      console.log("seed", seed.toString());
      // compute the proof
      const start = Date.now();
      const proof = sloth.compute(seed, prime, iterations);
      console.log("compute time", Date.now() - start, "ms", "vdf proof", proof);
      // this could be a mint function, etc
      const proofTx = await contract.prove(proof);
      await proofTx.wait();
    }
  }
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });

  async function main() {
    // We get the signer
    const [signer] = await ethers.getSigners();
    // get the contracts
    const deploy = await deployments.get("RandomVDFv1");
    const contract = await ethers.getContractAt(
      "RandomVDFv1",
      deploy.address,
      signer,
    );
    // the prime and iterations from the contract
    const prime = Number((await contract.prime()).toString());
    const iterations = Number((await contract.iterations()).toNumber());
    console.log("prime", prime.toString());
    console.log("iterations", iterations.toString());
    // create a new seed
    const tx = await contract.createSeed();
    await tx.wait();
    // get the seed
    const seed = Number((await contract.seeds(signer.address)).toString());
    console.log("seed", seed.toString());
    // compute the proof
    const start = Date.now();
    const proof = sloth.computeBeacon(seed, prime, iterations);
    console.log("compute time", Date.now() - start, "ms", "vdf proof", proof);
    // this could be a mint function, etc
    const proofTx = await contract.prove(proof);
    await proofTx.wait();
  }
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
