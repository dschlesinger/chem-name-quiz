function handleSMILES(Kekule, SMILES: String, previousAtom = undefined) {
    while (SMILES.length > 0) {

        for (let prfx of ['C', 'N', 'O', 'S', 'P', 'H', 'F', 'Br', 'Cl', 'I']) {

            if (SMILES.startsWith(prfx)) {
                
                console.log('Found prefix', prfx, 'in', SMILES);

                SMILES.replace(prfx, ''); // remove it

                // Create Atom
                let atom = (new Kekule.Atom()).setSymbol(prfx);

            }

        }

    }
}

export function SMILEStoKekule(Kekule, SMILES: String) {

    let mol = new Kekule.Molecule();

}

export async function generateMolecule() {
        
        const response = await fetch(
        '/api/generateMolecule',
        {
          method: 'POST',
          body: JSON.stringify({})
        },
      );

      const { SMILES } = await response.json();

      return SMILES
}