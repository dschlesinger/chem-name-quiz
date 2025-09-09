import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const { SMILES } = await request.json();

    console.log('received smiles', SMILES)

    const encodedSMILES = encodeURIComponent(SMILES);

    const api_path = `https://cactus.nci.nih.gov/chemical/structure/${encodedSMILES}/iupac_name`

    const response = await fetch(api_path);

    if (!response.ok) {

        console.log('response', response)

        return { name: null };
    }

    const name = await response.text();

    console.log('response text', name)

    return json({ name })
};