export default (profile: {[k: string]: string}): boolean => {

    return profile.passday != undefined && profile.passday != null && profile.passday != "" &&
    profile.passimage != undefined && profile.passimage != null && profile.passimage != "" &&
    profile.passmonth != undefined && profile.passmonth != null && profile.passmonth != "" &&
    profile.passyear != undefined && profile.passyear != null && profile.passyear != "" &&

    profile.selfiurl != undefined && profile.selfiurl != null && profile.selfiurl != "" &&
    
    profile.drday != undefined && profile.drday != null && profile.drday != "" &&
    profile.drimage != undefined && profile.drimage != null && profile.drimage != "" &&
    profile.drmonth != undefined && profile.drmonth != null && profile.drmonth != "" &&
    profile.dryear != undefined && profile.drmonth != null && profile.drmonth != "";
}