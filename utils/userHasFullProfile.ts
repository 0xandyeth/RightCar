import userIsCompany from "./userIsCompany";

export default (profile: {[k: string]: string}): boolean => {

    const hasBasicData = profile.emailaddress !== null && profile.emailaddress !== undefined && profile.emailaddress !== "" &&
    profile.mobilenumber !== null && profile.mobilenumber !== undefined && profile.mobilenumber !== "" &&
    profile.firstname !== null && profile.firstname !== undefined && profile.firstname !== "" &&
    profile.lastname !== null && profile.lastname !== undefined && profile.lastname !== "" &&
    profile.mobilecode !== null && profile.mobilecode !== undefined && profile.mobilecode !== "" &&
    profile.add1 !== null && profile.add1 !== undefined && profile.add1 !== "" &&
    profile.city !== null && profile.city !== undefined && profile.city !== "" &&
    profile.postcode !== null && profile.postcode !== undefined && profile.postcode !== "" &&
    profile.country !== null && profile.country !== undefined && profile.country !== "";

    let hasCompanyData = true
    if (profile.company != undefined && profile.company != null && profile.vat != undefined && profile.vat != null && userIsCompany(profile)) {
        hasCompanyData = profile.company != 'NONE' && profile.vat != 'NONE';
    }

    return hasBasicData && hasCompanyData;
}