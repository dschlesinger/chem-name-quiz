export function colorAtom(atomType: string): string {

    switch (atomType) {

        case 'hydrogen':
            return '#eee'
        case 'carbon':
            return '#000'
        case 'oxygen':
            return '#e00'
        default:
            return '#e0e'
    } 

}