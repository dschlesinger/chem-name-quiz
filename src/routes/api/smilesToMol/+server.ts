import initRDKitModule from "@rdkit/rdkit";
import { json } from "@sveltejs/kit";

const RDKit = await initRDKitModule();

export const POST = async ({ request }) => {

    const { SMILES } = await request.json();

    const molecule = RDKit.get_mol(SMILES);

    const mol = molecule.get_molblock();

    return json({
        mol
    })

}