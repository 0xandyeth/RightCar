export default (acrissCode: string) => {
    let doors = '4-5'
    if (acrissCode[1] == 'B') doors = '2-3'
    if (acrissCode[1] == 'C') doors = '2-4'
    if (acrissCode[1] == 'D') doors = '4-5'

    return doors
}