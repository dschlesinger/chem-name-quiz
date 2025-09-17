export interface PreviousExample {
    correct: boolean,
    question_type: 'naming' | 'structure',
    answer: String, // Correct cannonical SMILES or UIPAC name
    guess: String, // User inputed cannonical SMILES or UIPAC name
    timeStamp: string, // Why not
}

// point current to name or draw based on page
export let previousExamples = $state({current: [], name: [], draw: []});