
export class UrlHelper {
    constructor() {}
    public static getUrlAddress(baseUrl: string, urlTemplate: string, urlParams: object = new Object(), urlQueryStrings: Object = new Object()): string {
      const url = UrlHelper.createUrlByTemplate(urlTemplate, urlParams, urlQueryStrings);
      return baseUrl + url;
    }
  
    private static createUrlByTemplate(urlTemplate: string, params?: object, queryStrings?: object) {
      urlTemplate = this.replaceUrlParams(urlTemplate, params || {});
      urlTemplate = this.getQueryStringParams(urlTemplate, queryStrings);
      return urlTemplate;
    }
  
    private static replaceUrlParams(url: string, params: object): string {
      Object.entries(params).forEach((item) => {
        var regex = new RegExp(`\\\${${item[0]}}`, 'g');
        url = url.replace(regex, encodeURIComponent(item[1]));
      });
      return url;
    }
  
    private static getQueryStringParams(url: string, queryStrings: Object = new Object()): string {
      let queryItems: string[] = [];
  
      if (Object.keys(queryStrings).length == 0) return url;
      Object.entries(queryStrings).forEach((item) => {
        var key = item[0];
        var value = item[1];
        if (value != null && value != undefined) {
          if(key == "filterValues"){
            Object.entries(value).forEach((filter , index) => {
              var param = "filter_"+ filter[0] + '=' + filter[1];
              queryItems.push(param);
            })
            
          }else{          
            var param = key + '=' + encodeURIComponent(value);
            queryItems.push(param);
          }
  
        }
      });
      if (queryItems.length > 0) {
        url = url + '?' + queryItems.join('&');
      }
      return url;
    }
  }
  