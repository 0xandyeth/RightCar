export default (acrissCode: string) => {
    if (RegExp("(M|N|C)").test(acrissCode[2])) {
        return "Manual"
    }
    if (RegExp("(A|B|D)").test(acrissCode[2])) {
        return "Automatic"
    }

}