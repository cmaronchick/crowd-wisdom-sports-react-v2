import * as api from '../src/api'


test('should receive a code from the authorize URL and parse it', async () => {
    const redirectUrl = `http://localhost:8080/?code=e41cb649-2001-4ba7-a690-ddc43426aa3f&state=cws-react`
    
    function getUrlParameters(redirectUrl, sParam) {
        const sURLQueryString = redirectUrl.split('?');
        const sURLVariables = sURLQueryString[1].split('&')
        console.log('sURLVariables: ', sURLVariables)
        for (var i = 0; i < sURLVariables.length; i++) {
            var sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] == sParam) {
                if (sParameterName[1].indexOf("#") > -1) {
                    var code = sParameterName[1].split('#');
                    return code[0];
                }
                return sParameterName[1];
            }
        }
    }
    expect(getUrlParameters(redirectUrl, 'code')).toBe('e41cb649-2001-4ba7-a690-ddc43426aa3f')
    
})