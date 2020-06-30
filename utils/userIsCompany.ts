export default (profile: {[k: string]: string} = {}): boolean => {

    return profile.company != undefined && profile.company != null && profile.company != 'NONE' &&
    profile.vat != undefined && profile.vat != null && profile.vat != 'NONE';
}