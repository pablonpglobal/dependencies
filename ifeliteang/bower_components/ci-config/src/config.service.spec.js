describe('ConfigSrv: Logger', function () {
    var paramsSrv, configSrv, $httpBackend;
    beforeEach(module('ci_config'));


    beforeEach(function() {
        module(function($provide) {
            $window = {
                location: {
                    protocol: 'http:',
                    href: 'http://www.test.com',
                    pathname: '/',
                    search: '?env=live'
                },
                navigator: {
                    userAgent: 'unknown'
                }
            };
            $provide.value('$window', $window);
        });
        inject(function(_paramsSrv_, _configSrv_, _$httpBackend_) {
            $httpBackend = _$httpBackend_;
            paramsSrv = _paramsSrv_;
            configSrv = _configSrv_;
        });
        $httpBackend.whenGET(/.*\/main\.html.*!/)
            .respond('<div></div>');
        $httpBackend.whenGET(/.*\/config.*.json/)
            .respond('{"flexITP": {"flexCharts": {"flexChartsURL": "https://trade.loginandtrade.com/tp/charts","ratesUrl": "pushpreprod.cityindextest9.co.uk","ratesUrlControlPort": "443","ratesUrlPort": "443","historicUrl": "https://ciapipreprod.cityindextest9.co.uk/tradingapi/","marketSearchUrl": "https://ciapipreprod.cityindextest9.co.uk/tradingapi/"},"tradingApiURL": "https://ciapipreprod.cityindextest9.co.uk/tradingapi/","vsClientProxy": "http://ciapipreprod.cityindextest9.co.uk/ClientDocumentsProxy/ClientProxy","viewStWebApp": "http://pkh-ppe-web01/flashASP/host/progs/ViewStatement/ViewStatement","onlineFundinghtm": "OnlineFundingView/transferfunds","onlineFundingWebApp": "https://qappitp.cityindex.co.uk/onlineFundingPCI","lsc": {"serverURL": "pushpreprod.cityindextest9.co.uk","controlPort": "443","port": "443"}}}');
    });


    it(':: Undefined', function () {
        var srvUrl;
        configSrv.getKeyValue('SrvUrl').then(function (_srvUrl) {
            srvUrl = _srvUrl;
        });
        $httpBackend.flush();
        expect(srvUrl).toBe('https://ciapipreprod.cityindextest9.co.uk/tradingapi/');
    });

    it(':: Defined', function () {
        var srvUrl;
        configSrv.getKeyValue('SrvUrl').then(function (_srvUrl) {
            srvUrl = _srvUrl;
        });
        $httpBackend.flush();
        expect(srvUrl).toBe('https://ciapipreprod.cityindextest9.co.uk/tradingapi/');
    });

    it(':: Defined at PPE', function () {
        var srvUrl;
        configSrv.getKeyValue('SrvUrl').then(function (_srvUrl) {
            srvUrl = _srvUrl;
        });
        $httpBackend.flush();
        expect(srvUrl).toBe('https://ciapipreprod.cityindextest9.co.uk/tradingapi/');
    })


});